"""Nexa backend service.

FastAPI entry point for chat, translation, document extraction, TTS, STT,
and local code execution. Supports local-first operation and packaged builds.
"""

import os
import sys
import re
import io
import json
import queue
import asyncio
import subprocess
import base64
import multiprocessing

multiprocessing.freeze_support()

# Configure local resource paths and offline behavior before loading NLP libs.
os.environ["STANZA_RESOURCES_DIR"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stanza_resources")
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"

from pathlib import Path
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, UploadFile, File, Request
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

import httpx
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import sounddevice as sd
import pdfplumber
from docx import Document as DocxDocument
from PIL import Image
from vosk import Model, KaldiRecognizer

from database import init_db, get_db
from models import Conversation, Message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                       # Allow all origins (for development)
    allow_methods=["*"],                       # Allow all HTTP methods
    allow_headers=["*"],                       # Allow all headers
)

init_db()
def strip_markdown(text: str) -> str:
    """Return plain text by removing common markdown syntax.
    
    Args:
        text (str): The markdown-formatted text.
        
    Returns:
        str: The stripped plain text.
    """
    # Remove heading tags
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'\*{1,3}([^*\n]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,3}([^_\n]+)_{1,3}', r'\1', text)
    text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    text = re.sub(r'^\s*[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*>\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    text = re.sub(r'[*#~]+', '', text)
    return text

def compress_image_b64(image_b64: str, max_size: int = 512) -> str:
    """Downscale and recompress a base64 image for model input.
    
    Args:
        image_b64 (str): The base64 encoded image string.
        max_size (int, optional): The maximum width/height to resize to. Defaults to 512.
        
    Returns:
        str: The recompressed base64 encoded image string.
    """
    try:
        # Decode the base64 string to raw image bytes
        img_bytes = base64.b64decode(image_b64)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img.thumbnail((max_size, max_size), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception as e:
        print(f"[Image compress] Error: {e}")
        return image_b64

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PIPER_DIR   = os.path.join(BASE_DIR, "piper")
PIPER_EXE   = os.path.join(PIPER_DIR, "piper.exe")
PIPER_MODEL = os.path.join(PIPER_DIR, "en_US-amy-medium.onnx")

VOSK_MODEL_PATH = os.path.join(BASE_DIR, "vosk-model")

OLLAMA_URL  = "http://127.0.0.1:11434/api/generate"

if not os.path.isfile(PIPER_EXE):
    print(f"[WARNING] Piper not found: {PIPER_EXE}")
if not os.path.isfile(PIPER_MODEL):
    print(f"[WARNING] Piper model not found: {PIPER_MODEL}")

vosk_model = Model(VOSK_MODEL_PATH)

MODEL_MAP = {
    "Gemma2B": "gemma:2b",
    "Phi3":    "phi3",
    "Mistral": "mistral:latest",
}

class ChatMessage(BaseModel):
    """Payload for an incoming chat message."""
    text: str
    model: str = "Phi3"
    conversation_id: int = None
    image_base64: str = None

class RenamePayload(BaseModel):
    """Payload for renaming an existing conversation."""
    title: str

class TitlePayload(BaseModel):
    """Payload for providing text to generate a conversation title."""
    text: str

class TranslatePayload(BaseModel):
    """Payload for specifying text and the target language for translation."""
    text: str
    target_language: str

class PartialPayload(BaseModel):
    """Payload for periodically saving partial assistant message responses."""
    content: str

@app.get("/")
def read_root():
    """Health endpoint for basic service availability.
    
    Returns:
        dict: A simple welcome message indicating the service is running.
    """
    return {"message": "Nexa backend is running!"}

@app.get("/runtime-status")
def runtime_status():
    """Lightweight readiness endpoint.
    
    Returns:
        dict: The current operational status of the service.
    """
    return {"status": "ok"}


@app.post("/translate")
async def translate_text(payload: TranslatePayload):
    """Translate text with Argos Translate using local packages.
    
    Args:
        payload (TranslatePayload): The text to translate and target language.
        
    Returns:
        dict: A dictionary containing the translated text or an error message.
    """
    # Configure Argos Translate to use the local package directory
    argos_base = os.path.join(BASE_DIR, "argos_packages")
    os.environ["ARGOS_PACKAGES_DIR"] = argos_base

    from argostranslate import translate, settings
    settings.data_dir = Path(argos_base)
    settings.package_data_dir = Path(argos_base)
    settings.remote_package_index = ""

    LANG_CODES = {
        "urdu":    "ur",
        "hindi":   "hi",
        "chinese": "zh",
    }
    target_code = LANG_CODES.get(payload.target_language.lower(), payload.target_language)

    def clean_line(line: str) -> str:
        line = re.sub(r'^#{1,6}\s*', '', line)
        line = re.sub(r'^\s*[-*+]\s+', '', line)
        line = re.sub(r'^\s*\d+\.\s+', '', line)
        line = re.sub(r'\*+([^*\n]+)\*+', r'\1', line)
        line = re.sub(r'\*+', '', line)
        line = re.sub(r'_{1,2}([^_]+)_{1,2}', r'\1', line)
        line = re.sub(r'`([^`]+)`', r'\1', line)
        line = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line)
        line = re.sub(r'^={2,}|-{2,}', '', line)
        return line.strip()

    def is_mostly_rtl(text: str) -> bool:
        rtl_chars = len(re.findall(r'[\u0600-\u06FF\u0750-\u077F]', text))
        total_chars = len(re.sub(r'\s', '', text))
        return total_chars > 0 and rtl_chars / total_chars > 0.4

    def translate_line(text: str, t) -> str:
        """Translate text with short-line and chunked-line strategies."""
        if not text.strip():
            return ''
        if is_mostly_rtl(text):
            return text

        if len(text) <= 100:
            result = t.translate(text)
            return result if result != text else ''

        chunks = re.split(r'(?<=[.!?:,])\s+', text)
        merged = []
        current = ""
        for chunk in chunks:
            if len(current) + len(chunk) + 1 <= 100:
                current += (" " if current else "") + chunk
            else:
                if current:
                    merged.append(current)
                current = chunk
        if current:
            merged.append(current)

        parts = []
        for chunk in merged:
            result = t.translate(chunk)
            if result and result != chunk:
                parts.append(result)
        return ' '.join(parts)

    try:
        installed = translate.get_installed_languages()
        from_lang = next((l for l in installed if l.code == "en"), None)
        to_lang   = next((l for l in installed if l.code == target_code), None)

        if not from_lang or not to_lang:
            return {"translated": payload.text, "error": f"Language '{target_code}' not installed"}

        t = from_lang.get_translation(to_lang)

        lines = payload.text.split('\n')
        translated_lines = []
        for line in lines:
            cleaned = clean_line(line)
            if cleaned:
                translated_lines.append(translate_line(cleaned, t))
            else:
                translated_lines.append('')

        result = '\n'.join(translated_lines)
        return {"translated": result}

    except Exception as e:
        print(f"[Translate] Error: {e}")
        return {"translated": payload.text, "error": str(e)}


@app.get("/translate/languages")
def list_languages():
    """Return installed Argos language packs.
    
    Returns:
        dict: A dictionary containing a list of installed language code and name mappings.
    """
    argos_base = os.path.join(BASE_DIR, "argos_packages")
    from argostranslate import translate, settings
    settings.data_dir = Path(argos_base)
    settings.package_data_dir = Path(argos_base)
    installed = translate.get_installed_languages()
    return {"installed": [{"code": l.code, "name": l.name} for l in installed]}


@app.get("/tts/stream")
def tts_stream(text: str):
    """Stream raw TTS audio as float32 samples.
    
    Args:
        text (str): The text to be converted to speech.
        
    Returns:
        StreamingResponse: An audio stream of float32 PCM samples, or an error response.
    """
    if not os.path.isfile(PIPER_EXE) or not os.path.isfile(PIPER_MODEL):
        return Response(content="Piper TTS not configured.", status_code=503)

    def generate():
        """Yield PCM audio frames converted to float32 for playback."""
        try:
            proc = subprocess.Popen(
                [PIPER_EXE, "--model", PIPER_MODEL, "--output-raw"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                cwd=PIPER_DIR,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
            proc.stdin.write(text.encode("utf-8"))
            proc.stdin.close()
            yield (22050).to_bytes(4, "big")
            CHUNK = 4096
            while True:
                chunk = proc.stdout.read(CHUNK)
                if not chunk:
                    break
                samples_int16  = np.frombuffer(chunk, dtype=np.int16)
                samples_float32 = samples_int16.astype(np.float32) / 32768.0
                yield samples_float32.tobytes()
            proc.wait()
        except Exception as e:
            print(f"[Piper] Error: {e}")

    return StreamingResponse(
        generate(),
        media_type="application/octet-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Extract text from PDF or DOCX with a safe size cap.
    
    Args:
        file (UploadFile): The uploaded document file (PDF or DOCX).
        
    Returns:
        dict: A dictionary containing the extracted text, possibly truncated.
    """
    content = await file.read()
    text = ""
    
    if file.filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    elif file.filename.endswith(".docx"):
        doc = DocxDocument(io.BytesIO(content))
        for para in doc.paragraphs:
            if para.text.strip():
                text += para.text + "\n"
    
    MAX_CHARS = 4000
    trimmed = text.strip()[:MAX_CHARS]
    if len(text.strip()) > MAX_CHARS:
        trimmed += "\n\n[Document truncated]"
    return {"text": trimmed or "[No readable text found]"}


@app.post("/chat")
async def chat(message: ChatMessage, request: Request, db: Session = Depends(get_db)):
    """Stream chat responses with optional image analysis and persistence.
    
    Args:
        message (ChatMessage): The incoming chat message payload.
        request (Request): The FastAPI request object, used for tracking disconnects.
        db (Session): The database session.
        
    Returns:
        StreamingResponse: Server-Sent Events (SSE) stream yielding generated tokens.
    """
    if message.conversation_id is None:
        conversation = Conversation(title="...")
        db.add(conversation)
        db.commit()
        conversation_id = conversation.id
    else:
        conversation_id = message.conversation_id

    user_msg = Message(conversation_id=conversation_id, role="user", content=message.text, image_base64=message.image_base64)
    db.add(user_msg)
    db.commit()

    ollama_model = MODEL_MAP.get(message.model, message.model.lower())

    async def generate():
        """Yield server-sent events for model tokens and status."""
        full_reply = ""

        if message.image_base64:
            try:
                prompt = message.text.strip() if message.text.strip() else "Describe this image in detail."
                compressed = compress_image_b64(message.image_base64)
                payload = {
                    "model":  "moondream",
                    "prompt": prompt,
                    "images": [compressed],
                    "stream": True,
                }
                async with httpx.AsyncClient(timeout=300) as client:
                    async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                        response.raise_for_status()
                        async for line in response.aiter_lines():
                            if await request.is_disconnected():
                                if full_reply.strip():
                                    assistant_msg = Message(
                                        conversation_id=conversation_id,
                                        role="assistant",
                                        content=full_reply,
                                    )
                                    db.add(assistant_msg)
                                    db.commit()
                                return
                            if not line:
                                continue
                            try:
                                data = json.loads(line)
                            except Exception:
                                continue
                            token = data.get("response", "")
                            if token:
                                full_reply += token
                                yield f"data: {json.dumps({'token': token, 'conversation_id': conversation_id})}\n\n"
                            if data.get("done"):
                                assistant_msg = Message(
                                    conversation_id=conversation_id,
                                    role="assistant",
                                    content=full_reply,
                                )
                                db.add(assistant_msg)
                                db.commit()
                                yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
                                return
            except httpx.ConnectError:
                msg = "Cannot connect to Ollama."
                yield f"data: {json.dumps({'token': msg, 'conversation_id': conversation_id})}\n\n"
                yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
            except Exception as e:
                msg = f"Image error: {str(e)}"
                yield f"data: {json.dumps({'token': msg, 'conversation_id': conversation_id})}\n\n"
                yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
            return

        is_doc_message = "[Document:" in message.text
        fmt = "You are a helpful assistant. Use headings, bullet points and markdown formatting appropriately."

        if is_doc_message:
            if ollama_model == "mistral:latest":
                prompt = f"[INST] {fmt} Read the following document carefully and answer based on it.\n\n{message.text} [/INST]"
            elif ollama_model == "gemma:2b":
                prompt = f"<start_of_turn>user\nRead this document and answer:\n\n{message.text}<end_of_turn>\n<start_of_turn>model\n"
            else:
                prompt = f"<|system|>\n{fmt}<|end|>\n<|user|>\nRead the following document carefully and answer based on it.\n\n{message.text}<|end|>\n<|assistant|>\n"
        else:
            if ollama_model == "mistral:latest":
                prompt = f"[INST] {fmt}\n\n{message.text} [/INST]"
            elif ollama_model == "gemma:2b":
                prompt = f"<start_of_turn>user\n{message.text}<end_of_turn>\n<start_of_turn>model\n"
            else:
                prompt = f"<|system|>\n{fmt}<|end|>\n<|user|>\n{message.text}<|end|>\n<|assistant|>\n"

        try:
            payload = {"model": ollama_model, "prompt": prompt, "stream": True}
            async with httpx.AsyncClient(timeout=300) as client:
                async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if await request.is_disconnected():
                            if full_reply.strip():
                                assistant_msg = Message(
                                    conversation_id=conversation_id,
                                    role="assistant",
                                    content=full_reply,
                                )
                                db.add(assistant_msg)
                                db.commit()
                            return
                        if not line:
                            continue
                        try:
                            data = json.loads(line)
                        except Exception:
                            continue
                        token = data.get("response", "")
                        if token:
                            full_reply += token
                            yield f"data: {json.dumps({'token': token, 'conversation_id': conversation_id})}\n\n"
                        if data.get("done"):
                            assistant_msg = Message(
                                conversation_id=conversation_id,
                                role="assistant",
                                content=full_reply,
                            )
                            db.add(assistant_msg)
                            db.commit()
                            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
                            return

        except httpx.ConnectError:
            msg = "Cannot connect to Ollama. Make sure Ollama is running."
            yield f"data: {json.dumps({'token': msg, 'conversation_id': conversation_id})}\n\n"
            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
        except httpx.TimeoutException:
            msg = "Model timed out. Try a shorter message."
            yield f"data: {json.dumps({'token': msg, 'conversation_id': conversation_id})}\n\n"
            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"
        except Exception as e:
            msg = f"Backend error: {str(e)}"
            yield f"data: {json.dumps({'token': msg, 'conversation_id': conversation_id})}\n\n"
            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation_id})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no"},
    )


@app.post("/conversations/{conversation_id}/generate-title")
def generate_title(conversation_id: int, payload: TitlePayload, db: Session = Depends(get_db)):
    """Generate a short conversation title using the LLM.
    
    Args:
        conversation_id (int): The ID of the conversation to rename.
        payload (TitlePayload): The text context to base the title upon.
        db (Session): The database session.
        
    Returns:
        dict: The newly generated or fallback title.
    """
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        return {"title": "New Chat"}
    try:
        prompt = f"Generate a 4-6 word title for this chat. Reply with ONLY the title:\n\n{payload.text[:500]}"
        import requests as req
        response = req.post(
            OLLAMA_URL,
            json={"model": "phi3", "prompt": prompt, "stream": False},
            timeout=30,
        )
        title = response.json().get("response", "").strip().strip('"\'').strip()[:60]
        title = strip_markdown(title)
        if title:
            convo.title = title
            db.commit()
        return {"title": title or "New Chat"}
    except Exception:
        fallback = payload.text[:40].strip()
        convo.title = fallback or "New Chat"
        db.commit()
        return {"title": convo.title}


@app.get("/conversations")
def get_conversations(db: Session = Depends(get_db)):
    """Return conversations ordered by most recent first.
    
    Args:
        db (Session): The database session.
        
    Returns:
        list: A list of Conversation models representing chat history.
    """
    return db.query(Conversation).order_by(Conversation.id.desc()).all()

@app.get("/conversations/{conversation_id}")
def get_messages(conversation_id: int, db: Session = Depends(get_db)):
    """Return messages for a given conversation.
    
    Args:
        conversation_id (int): The conversation ID.
        db (Session): The database session.
        
    Returns:
        list: A list of serialized Message dictionaries for the conversation.
    """
    msgs = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    return [
        {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "role": m.role,
            "content": m.content,
            "image_base64": m.image_base64,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in msgs
    ]


@app.delete("/conversations/all")
def delete_all_conversations(db: Session = Depends(get_db)):
    """Remove all conversations and messages from the database.
    
    Args:
        db (Session): The database session.
        
    Returns:
        dict: A confirmation message.
    """
    db.query(Message).delete()
    db.query(Conversation).delete()
    db.commit()
    return {"message": "All conversations deleted"}


@app.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Delete a single conversation and its associated messages.
    
    Args:
        conversation_id (int): The target conversation ID.
        db (Session): The database session.
        
    Returns:
        dict: A confirmation message upon successful deletion.
    """
    db.query(Message).filter(Message.conversation_id == conversation_id).delete()
    db.query(Conversation).filter(Conversation.id == conversation_id).delete()
    db.commit()
    return {"message": "Conversation deleted"}


@app.patch("/conversations/{conversation_id}/rename")
def rename_conversation(conversation_id: int, payload: RenamePayload, db: Session = Depends(get_db)):
    """Rename a conversation's title manually.
    
    Args:
        conversation_id (int): The conversation ID.
        payload (RenamePayload): The payload containing the new title.
        db (Session): The database session.
        
    Returns:
        dict: A success or error status message.
    """
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        return {"error": "Not found"}
    convo.title = payload.title.strip()[:60]
    db.commit()
    return {"message": "Renamed"}


@app.post("/conversations/{conversation_id}/save-partial")
def save_partial_message(conversation_id: int, payload: PartialPayload, db: Session = Depends(get_db)):
    """Persist a partial assistant response to enable recovery upon disconnect.
    
    Args:
        conversation_id (int): The conversation ID.
        payload (PartialPayload): The partial content to append to the conversation.
        db (Session): The database session.
        
    Returns:
        dict: A confirmation message if saved successfully.
    """
    if payload.content.strip():
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=payload.content.strip(),
        )
        db.add(assistant_msg)
        db.commit()
    return {"message": "Saved"}


@app.websocket("/ws/voice")
async def voice_ws(websocket: WebSocket):
    """Stream microphone audio to Vosk for partial and final STT transcripts.
    
    Args:
        websocket (WebSocket): The active WebSocket connection for bidirectional audio and text data.
    """
    await websocket.accept()
    rec = KaldiRecognizer(vosk_model, 16000)
    audio_queue = queue.Queue()
    listening = True

    def mic_callback(indata, frames, time, status):
        if listening:
            audio_queue.put(bytes(indata))

    stream = sd.RawInputStream(
        samplerate=16000, blocksize=4000, dtype="int16",
        channels=1, callback=mic_callback
    )
    stream.start()

    try:
        while True:
            await asyncio.sleep(0.05)
            while not audio_queue.empty():
                data = audio_queue.get()
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    text = result.get("text", "").strip()
                    if text:
                        await websocket.send_json({"type": "final", "text": text})
                else:
                    partial = json.loads(rec.PartialResult())
                    text = partial.get("partial", "").strip()
                    if text:
                        await websocket.send_json({"type": "partial", "text": text})
    except WebSocketDisconnect:
        pass
    finally:
        listening = False
        stream.stop()
        stream.close()

class RunCodePayload(BaseModel):
    """Payload for executing a block of Python code with optional inputs."""
    code: str
    inputs: list = []


@app.post("/run-python")
async def run_python_code(payload: RunCodePayload):
    """Execute user-provided Python code and capture stdout, stderr, and matplotlib plots.
    
    Args:
        payload (RunCodePayload): The code to execute and list of mock inputs.
        
    Returns:
        dict: Contains stdout text, stderr text, and a list of base64-encoded plot images.
    """
    import traceback
    import matplotlib
    matplotlib.use("Agg")
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    exec_globals = {"__builtins__": __builtins__, "_input_values": list(payload.inputs), "_input_index": [0]}
    setup = """
import sys,io,base64,matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
def _show(*a,**k):
    buf=io.BytesIO()
    plt.savefig(buf,format="png",bbox_inches="tight",dpi=120)
    buf.seek(0)
    print("__PLOT__:"+base64.b64encode(buf.read()).decode())
    plt.close("all")
plt.show=_show

def _input(prompt=""):
    idx = _input_index[0]
    if idx < len(_input_values):
        val = str(_input_values[idx]).strip()
        _input_index[0] += 1
        sys.stdout.write(str(prompt) + val + "\\n")
        sys.stdout.flush()
        return val
    return ""
import builtins
builtins.input = _input
"""
    try:
        sys.stdout, sys.stderr = stdout_buf, stderr_buf
        exec(setup, exec_globals)
        exec(payload.code, exec_globals)
    except Exception:
        stderr_buf.write(traceback.format_exc())
    finally:
        sys.stdout, sys.stderr = sys.__stdout__, sys.__stderr__
    out = stdout_buf.getvalue()
    clean = [l for l in out.split("\n") if not l.startswith("__PLOT__:")]
    plots = [l[9:] for l in out.split("\n") if l.startswith("__PLOT__:")]
    return {"stdout": "\n".join(clean), "stderr": stderr_buf.getvalue(), "plots": plots}



@app.websocket("/ws")
async def ws_dummy(websocket: WebSocket):
    """Close unused websocket endpoint.
    
    Args:
        websocket (WebSocket): The active WebSocket connection.
    """
    await websocket.close()



if __name__ == "__main__" or getattr(sys, 'frozen', False):
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)