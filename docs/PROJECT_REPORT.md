# NEXA — Your Private Offline AI Assistant

## Project Report

---

**Project Title:** Nexa — Private Offline AI Assistant

**Authors:**
- **Noman Rafique** (2k25-BSAI-06)
- **Maryam Fatima** (2k25-BSAI-05)

**Degree Program:** BS Artificial Intelligence

**Version:** 1.0.0

**Year:** 2026

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives](#4-objectives)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Features](#7-features)
8. [System Design](#8-system-design)
9. [Data Storage](#9-data-storage)
10. [API Endpoints](#10-api-endpoints)
11. [AI/ML Models](#11-aiml-models)
12. [Security Measures](#12-security-measures)
13. [Installation & Deployment](#13-installation--deployment)
14. [Testing](#14-testing)
15. [Limitations](#15-limitations)
16. [Future Work](#16-future-work)
17. [Conclusion](#17-conclusion)
18. [References](#18-references)

---

## 1. Abstract

Nexa is a fully offline, privacy-first AI assistant designed to run entirely on the user's local machine without requiring internet connectivity. It integrates large language models (Gemma 2B, Phi-3, Mistral), image understanding (Moondream), real-time speech recognition (Vosk), text-to-speech (Piper), multi-language translation (Argos Translate), document processing (PDF/DOCX), and an in-browser Python code runner (Pyodide) — all within a single desktop application built on Electron. The system processes all data locally, ensuring zero data leakage to cloud services, making it suitable for privacy-sensitive environments including education, healthcare, and defense.

---

## 2. Introduction

The proliferation of cloud-based AI assistants (ChatGPT, Gemini, Claude) has raised significant privacy concerns. Every user prompt, document, and conversation is transmitted to and stored on remote servers. For users in privacy-sensitive domains — students, researchers, healthcare workers, military personnel — this represents an unacceptable risk.

Nexa addresses this gap by providing a capable AI assistant that operates entirely offline. All inference, translation, speech processing, and data storage happen on the user's machine. No internet connection is required after initial setup.

The application provides a modern, themeable chat interface with support for text conversations, image analysis, voice input, document processing, code execution, note-taking, and multi-language translation — packaged as a standalone Windows desktop application.

---

## 3. Problem Statement

Existing AI assistants suffer from the following limitations:

- **Privacy Risk:** All user data is sent to and stored on cloud servers, exposing sensitive conversations, documents, and personal information.
- **Internet Dependency:** Cloud-based assistants cannot function without an active internet connection, limiting usability in offline or low-connectivity environments.
- **Cost:** Subscription-based AI services impose recurring costs that may be prohibitive for students and individuals in developing regions.
- **Limited Multilingual Support:** Most AI assistants prioritize English, with limited or no support for Urdu, Hindi, and Chinese — languages spoken by over 2.5 billion people.
- **No Local Code Execution:** Cloud assistants cannot execute code locally, requiring users to switch between tools.

Nexa solves all of these problems by running entirely on the user's hardware.

---

## 4. Objectives

1. Build a fully offline AI assistant with zero cloud dependency after setup
2. Integrate multiple open-source LLMs for text generation and image understanding
3. Implement real-time speech recognition and text-to-speech for accessibility
4. Provide multi-language translation supporting English → Urdu, Hindi, and Chinese
5. Enable document processing (PDF, DOCX) for context-aware question answering
6. Include an in-browser Python code runner for educational and productivity use
7. Design a modern, themeable, and accessible user interface
8. Package the entire system as a standalone Windows desktop application
9. Ensure all user data remains on the local machine with no external transmission

---

## 5. System Architecture

Nexa follows a **three-tier architecture** with an Electron desktop shell orchestrating a Python backend and a React frontend:

```
┌─────────────────────────────────────────────────────────┐
│                    ELECTRON SHELL                       │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ Loading  │  │ Main Window  │  │ Process Manager │    │
│  │ Screen   │  │ (BrowserWin) │  │ (Ollama+Backend)│    │
│  └──────────┘  └──────┬───────┘  └─────────────────┘    │
│                        │                                │
│         ┌──────────────┴──────────────┐                 │
│         │       PRELOAD BRIDGE        │                 │
│         │   (contextBridge / IPC)     │                 │
│         └──────────────┬──────────────┘                 │
└────────────────────────┼────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                   REACT FRONTEND                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐    │
│  │ Sidebar │ │ChatWindow| │MessageInp| │CodeRunner │    │
│  └─────────┘ └──────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐   │
│  │Onboarding│ │ Notepad  │ │API Client│ │ Pyodide   │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘   │
│                         │                               │
│              api.js (HTTP/SSE/WS)                       │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│                PYTHON BACKEND (FastAPI)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  ┌───────────┐  │
│  │/chat     │ │/translate│ │/tts/stream│ │/ws/voice  │  │
│  │(SSE)     │ │          │ │           │ │(WebSocket)│  │
│  └─────┬────┘ └─────┬────┘ └────┬─────┘  └────┬───── ┘  │
│        │            │           │             │         │
│  ┌─────┴────┐ ┌─────┴────┐ ┌────┴─────┐ ┌─────┴─────┐   │
│  │  Ollama  │ │  Argos   │ │  Piper   │ │   Vosk    │   │
│  │  (LLMs)  │ │Translate │ │  (TTS)   │ │  (STT)    │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘   │
│  ┌──────────┐ ┌──────────┐                              │
│  │ SQLite   │ │PDF/DOCX  │                              │
│  │ Database │ │Extractor │                              │
│  └──────────┘ └──────────┘                              │
└─────────────────────────────────────────────────────────┘
```

### Component Roles

| Component | Role |
|---|---|
| **Electron Shell** | Desktop window management, process lifecycle, IPC bridge, system integration |
| **React Frontend** | User interface, state management, streaming display, code execution |
| **FastAPI Backend** | API server, LLM orchestration, translation, TTS, STT, document processing |
| **Ollama** | Local LLM inference engine (Gemma, Phi-3, Mistral, Moondream) |
| **SQLite** | Persistent conversation and message storage |

---

## 6. Technology Stack

### 6.1 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI framework, component-based architecture |
| React Scripts | 5.0.1 | Build toolchain (CRA) |
| Axios | 1.15.2 | HTTP client for API calls |
| React Markdown | 7.1.2 | Rendering AI responses with markdown formatting |
| React Icons | 5.6.0 | Icon library (Feather Icons, Ionicons) |
| PrismJS | 1.30.0 | Syntax highlighting for code blocks |
| React Simple Code Editor | 0.14.1 | Lightweight code editor component |
| jsPDF | 4.2.1 | PDF export for notes and conversations |
| docx | 9.6.1 | DOCX export for conversations |
| file-saver | 2.0.5 | Client-side file download triggers |
| Pyodide | — | In-browser Python runtime (WASM-based) |
| emoji-picker-react | 4.19.0 | Emoji selection UI |

### 6.2 Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Backend programming language |
| FastAPI | — | Async web framework, API server |
| Uvicorn | — | ASGI server for FastAPI |
| SQLAlchemy | — | ORM for database operations |
| Pydantic | — | Request/response validation |
| httpx | — | Async HTTP client for Ollama communication |
| Vosk | — | Offline speech recognition |
| sounddevice | — | Microphone audio capture |
| Argos Translate | — | Offline neural machine translation |
| Piper TTS | — | Offline text-to-speech synthesis |
| pdfplumber | — | PDF text extraction |
| python-docx | — | DOCX text extraction |
| NumPy | — | Audio data processing (int16 → float32) |

### 6.3 Desktop Application

| Technology | Version | Purpose |
|---|---|---|
| Electron | 28.0.0 | Desktop application shell (Chromium + Node.js) |
| electron-builder | 24.0.0 | Packaging and distribution (NSIS installer) |
| electron-store | 8.1.0 | Persistent key-value storage for app settings |
| Inno Setup | 6.7.1 | Custom Windows installer with language selection |

### 6.4 AI/ML Models

| Model | Type | Purpose |
|---|---|---|
| Gemma 2B | LLM (2B params) | Lightweight text generation |
| Phi-3 | LLM (3.8B params) | Balanced performance text generation |
| Mistral 7B | LLM (7B params) | High-quality text generation |
| Moondream | Vision-Language Model | Image understanding and description |
| Vosk Model | Speech Recognition | Real-time voice-to-text (English) |
| Piper (en_US-amy) | Text-to-Speech | Natural-sounding English voice |
| Argos en→ur | Translation Model | English to Urdu translation |
| Argos en→hi | Translation Model | English to Hindi translation |
| Argos en→zh | Translation Model | English to Chinese translation |

### 6.5 Database

| Technology | Purpose |
|---|---|
| SQLite | Lightweight, serverless, file-based relational database |

---

## 7. Features

### 7.1 AI Chat with Multiple Models

Users can select from three language models — **Gemma 2B** (fast, lightweight), **Phi-3** (balanced), and **Mistral 7B** (high quality) — based on their hardware capabilities and response quality needs. Responses stream in real-time using Server-Sent Events (SSE), providing an immediate and interactive experience.

### 7.2 Image Understanding

Users can attach images to their messages. The system uses **Moondream**, a vision-language model, to analyze and describe images. Images are automatically compressed and resized before being sent to the model to optimize inference speed.

### 7.3 Voice Input (Speech-to-Text)

Real-time speech recognition powered by **Vosk** allows users to dictate messages using their microphone. A WebSocket connection streams audio from the browser to the backend, where Vosk processes it and returns partial and final transcriptions.

### 7.4 Text-to-Speech (TTS)

AI responses can be read aloud using **Piper TTS**, a neural text-to-speech engine. Audio is streamed as raw float32 PCM data from the backend, enabling playback without downloading the entire file first.

### 7.5 Multi-Language Translation

The system supports offline translation from English to **Urdu**, **Hindi**, and **Chinese** using **Argos Translate**. Translation handles markdown-stripped text, chunks long sentences, and skips already-translated RTL text to avoid double-translation.

### 7.6 Document Processing

Users can upload **PDF** and **DOCX** files. The backend extracts text content (up to 4000 characters), which is then fed into the LLM as context for question answering. This enables "chat with your document" functionality.

### 7.7 In-Browser Python Code Runner

A full **Pyodide-powered Python runtime** runs inside the browser, allowing users to execute Python code without any server-side execution. Features include:
- Auto-installation of missing packages via micropip
- Support for NumPy, Pandas, Matplotlib, and more
- Plot rendering directly in the UI
- Async `input()` support via custom preprocessing
- 60-second timeout protection
- Sample code snippets for quick start

### 7.8 Notepad Tool

A built-in note-taking tool with:
- Create, edit, rename, and delete notes
- Save notes persistently (electron-store or localStorage)
- Export notes as PDF
- Copy and paste functionality
- Unsaved changes confirmation dialog

### 7.9 Conversation Management

Full conversation lifecycle management:
- Create new chats
- Auto-generate titles using the LLM
- Rename conversations
- Delete individual or all conversations
- Persistent storage in SQLite database
- Conversation history sidebar with search

### 7.10 Theme System

10 carefully designed themes allowing users to personalize the interface:

| Theme | Style |
|---|---|
| Forest | Green nature tones (default) |
| Midnight | Dark purple/blue |
| Sand | Warm desert tones |
| Ocean | Cool blue tones |
| Carbon | Pure dark mode |
| Blossom | Pink floral |
| Wine | Deep red tones |
| Sage | Muted green |
| Rust | Warm terracotta |
| Blade | Cool steel gray |

### 7.11 Onboarding Flow

First-time users are guided through a setup wizard where they enter their name and select an avatar. The profile is used for personalized greetings throughout the app.

### 7.12 Context-Aware Greetings

The app displays time-based greetings (Good Morning, Good Afternoon, etc.) personalized with the user's name, using the Karachi timezone. Special day messages (Pakistan Day, Independence Day, Iqbal Day, etc.) are shown for the first 10 minutes of the session.

### 7.13 Export Functionality

Conversations can be exported as:
- **PDF** (via jsPDF)
- **DOCX** (via the docx library)

### 7.14 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+Shift+N | New chat |
| Ctrl+Shift+H | Toggle sidebar |
| Ctrl+Shift+C | Toggle code runner |
| Ctrl+Shift+M | Switch model |
| Ctrl+Shift+P | Toggle notepad |
| Ctrl+Shift+E | Export conversation |
| Ctrl+Shift+K | Show shortcuts |
| Any letter key | Auto-focus message input |

### 7.15 Streaming with Abort Support

Chat responses stream token-by-token. Users can stop generation at any time, and the partial response is saved to the database. Each conversation maintains its own abort controller, allowing independent stream management.

---

## 8. System Design

### 8.1 Directory Structure

```
Nexa1/
├── backend/              # Python FastAPI backend
│   ├── main.py           # API routes and server logic
│   ├── models.py         # SQLAlchemy ORM models
│   ├── database.py       # Database engine and session management
│   ├── utils.py          # Utility functions
│   ├── requirements.txt  # Python dependencies
│   ├── piper/            # TTS engine and voice model
│   ├── vosk-model/       # Speech recognition model
│   ├── argos_packages/   # Translation models
│   └── venv311/          # Python virtual environment
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.js        # Main application component
│   │   ├── components/   # UI components
│   │   ├── services/     # API client
│   │   └── hooks/        # Custom React hooks
│   ├── public/           # Static assets
│   └── build/            # Production build output
├── electron/             # Electron desktop shell
│   ├── main.js           # Main process (window, IPC, processes)
│   ├── preload.js        # Context bridge (IPC API)
│   ├── loading.html      # Splash screen
│   ├── loading.js        # Splash animation
│   └── loading.css       # Splash styles
├── ollama/               # Ollama runtime and models
│   ├── ollama.exe        # LLM inference engine
│   └── models/           # Model weights and manifests
├── assets/               # App icons and splash assets
├── docs/                 # Documentation
├── scripts/              # Development utility scripts
└── src-tauri/            # Tauri config (alternative shell, unused)
```

### 8.2 Data Flow

**Chat Message Flow:**
```
User types message → MessageInput → App.js → api.js (POST /chat)
    → FastAPI receives → Saves user message to SQLite
    → Forwards to Ollama (http://127.0.0.1:11434/api/generate)
    → Ollama streams tokens back → FastAPI streams SSE events
    → api.js reads stream → App.js updates ChatWindow in real-time
    → On completion: saves assistant message to SQLite, generates title
```

**Voice Input Flow:**
```
User clicks mic → MessageInput opens WebSocket (ws://127.0.0.1:8000/ws/voice)
    → Browser streams microphone audio via WebSocket
    → FastAPI receives → Vosk processes audio → Returns partial/final text
    → MessageInput displays transcription → User sends as chat message
```

**Translation Flow:**
```
User clicks translate → App.js → api.js (POST /translate)
    → FastAPI receives → Strips markdown from text
    → Argos Translate processes (en → ur/hi/zh)
    → Returns translated text → ChatWindow displays
```

### 8.3 Process Lifecycle (Electron)

```
App starts
    ├── Check fresh install → wipe data if needed
    ├── Create loading window (splash screen)
    ├── Start Ollama server (ollama.exe serve)
    ├── Start Python backend (nexa-backend.exe or python main.py)
    ├── Wait for "Uvicorn running" in backend output
    ├── Create main window (loads frontend/build/index.html)
    ├── Send "backend-ready" event to renderer
    └── Create desktop shortcut (first run)

App quits
    ├── Kill backend process (SIGTERM)
    ├── Kill Ollama process (SIGTERM)
    └── Exit Electron
```

---

## 9. Data Storage

### 9.1 SQLite Database Schema

**Table: conversations**

| Column | Type | Description |
|---|---|---|
| id | INTEGER (PK) | Auto-incrementing conversation ID |
| title | VARCHAR | Conversation title (auto-generated or renamed) |
| created_at | DATETIME | Timestamp of creation |

**Table: messages**

| Column | Type | Description |
|---|---|---|
| id | INTEGER (PK) | Auto-incrementing message ID |
| conversation_id | INTEGER | Foreign key to conversations.id |
| role | VARCHAR | "user" or "assistant" |
| content | TEXT | Message text content |
| image_base64 | TEXT | Base64-encoded image (nullable) |
| created_at | DATETIME | Timestamp of creation |

### 9.2 Local Storage (Frontend)

| Key | Type | Purpose |
|---|---|---|
| nexa_theme | String | Selected theme ID |
| nexa_profile | JSON | User name and avatar |
| nexa_onboarded | String | Onboarding completion flag |
| nexa_notes | JSON | Saved notepad entries |
| nexa_last_seen | ISO String | Last session timestamp |

### 9.3 electron-store (Desktop)

| Key | Type | Purpose |
|---|---|---|
| theme | String | Selected theme ID |
| userProfile | JSON | User name and avatar |
| onboardingDone | Boolean | Onboarding completion flag |
| installId | UUID | Unique installation identifier |
| installFingerprint | String | Version + path + marker hash for fresh install detection |

---

## 10. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/runtime-status` | Backend and Ollama status |
| POST | `/chat` | Stream LLM response (SSE) |
| POST | `/translate` | Translate text to target language |
| GET | `/translate/languages` | List installed translation languages |
| GET | `/tts/stream` | Stream TTS audio for given text |
| POST | `/extract-text` | Extract text from uploaded PDF/DOCX |
| GET | `/conversations` | List all conversations |
| GET | `/conversations/{id}` | Get all messages for a conversation |
| DELETE | `/conversations/{id}` | Delete a conversation and its messages |
| DELETE | `/conversations/all` | Delete all conversations |
| PATCH | `/conversations/{id}/rename` | Rename a conversation |
| POST | `/conversations/{id}/generate-title` | Auto-generate conversation title |
| WS | `/ws/voice` | Real-time speech recognition |

---

## 11. AI/ML Models

### 11.1 Large Language Models (via Ollama)

All LLM inference is handled by **Ollama**, a lightweight local inference engine that runs GGUF-quantized models on CPU/GPU.

| Model | Parameters | Quantization | Use Case |
|---|---|---|---|
| Gemma 2B | 2B | Q4_K_M | Fast responses on low-end hardware |
| Phi-3 | 3.8B | Q4 | Balanced speed and quality |
| Mistral 7B | 7B | Q4_K_M | High-quality responses |
| Moondream | 1.8B | Q4 | Image understanding and description |

### 11.2 Prompt Engineering

Each model uses a specific prompt template:

- **Mistral:** `[INST] system prompt \n user message [/INST]`
- **Gemma:** `<start_of_turn>user\n message <end_of_turn>\n<start_of_turn>model\n`
- **Phi-3:** `<|system|> system prompt<|end|>\n<|user|> message<|end|>\n<|assistant|>`

The system prompt instructs the model to use markdown formatting and avoid code comments.

### 11.3 Speech Recognition (Vosk)

Vosk provides offline speech recognition using a Kaldi-based model. Audio is captured at 16kHz mono 16-bit PCM via the browser's microphone API and streamed over WebSocket. The recognizer provides:
- **Partial results** — real-time transcription as the user speaks
- **Final results** — complete sentence when the user pauses

### 11.4 Text-to-Speech (Piper)

Piper is a neural TTS engine that generates natural-sounding speech. The backend spawns `piper.exe` as a subprocess, pipes text via stdin, and streams raw PCM audio (22050 Hz, float32) to the frontend.

### 11.5 Translation (Argos Translate)

Argos Translate uses OpenNMT-based neural translation models. The system:
1. Strips markdown formatting from AI responses
2. Detects if text is already in the target language (RTL detection for Urdu)
3. Chunks long sentences at punctuation boundaries (max 100 chars)
4. Translates each chunk independently
5. Joins results preserving line structure

---

## 12. Security Measures

### 12.1 Electron Security

- **Context Isolation:** Enabled — renderer process cannot access Node.js APIs directly
- **Sandbox Mode:** Enabled — restricts renderer capabilities
- **Node Integration:** Disabled — prevents direct access to system APIs from web content
- **DevTools:** Blocked in production (F12 and Ctrl+Shift+I intercepted)
- **Navigation Lock:** Prevents navigation to external URLs
- **Popup Blocker:** All window.open calls are denied
- **Permission Denial:** All browser permission requests (camera, geolocation, etc.) are auto-denied
- **Custom Headers:** `X-Requested-With: Nexa` header added to all outgoing requests

### 12.2 Data Security

- **Local-only processing:** No data is transmitted to external servers
- **SQLite database:** Stored in user's AppData directory, not accessible remotely
- **No telemetry:** The application does not collect or transmit any usage data
- **Fresh install wipe:** On version change or reinstall, all user data is cleared

### 12.3 Backend Security

- **CORS:** Configured for local access only (127.0.0.1)
- **Offline mode:** `TRANSFORMERS_OFFLINE=1` and `HF_DATASETS_OFFLINE=1` prevent any HuggingFace calls
- **No authentication needed:** Single-user local application, no exposed network endpoints

---

## 13. Installation & Deployment

### 13.1 Development Setup

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm start

# Electron
cd electron
npm install
npm start
```

### 13.2 Production Build

The application is packaged using **electron-builder** with an NSIS installer:

```bash
cd electron
npm run dist          # Creates Nexa-Setup-1.0.0.exe (NSIS installer)
npm run dist-portable # Creates portable .exe (no installation needed)
```

### 13.3 Installer Features

- Custom NSIS installer with language selection (via Inno Setup integration)
- Desktop shortcut creation
- Start menu integration
- Optional installation directory
- Clean uninstall with AppData removal
- Auto-run after installation

### 13.4 Bundled Resources

The installer packages:
- Frontend production build (HTML/CSS/JS)
- Backend as standalone executable (PyInstaller-compiled)
- Ollama runtime and model weights
- Piper TTS engine and voice model
- Vosk speech recognition model
- Argos translation models
- Application icons and assets

---

## 14. Testing

### 14.1 Testing Approach

| Type | Tool | Coverage |
|---|---|---|
| Unit Tests | React Testing Library | Component rendering |
| Integration Tests | Manual + API testing | API endpoint functionality |
| E2E Tests | Manual | Full user flow testing |
| Performance | Manual observation | Streaming latency, TTS speed |

### 14.2 Test Scenarios

- Chat message send/receive with each model
- Image upload and analysis
- Voice input transcription
- Translation for all supported languages
- PDF and DOCX upload and text extraction
- Python code execution in code runner
- Notepad create/save/export/delete
- Theme switching and persistence
- Onboarding flow and profile saving
- Conversation rename/delete
- Export as PDF and DOCX
- Keyboard shortcuts
- Fresh install data wipe
- Application quit and process cleanup

---

## 15. Limitations

1. **Hardware Requirements:** Running 7B models requires at least 8GB RAM; larger models need more
2. **Windows Only:** Currently packaged only for Windows (no macOS/Linux build)
3. **English STT Only:** Vosk model supports English speech recognition only
4. **English TTS Only:** Piper voice model is English-only
5. **Translation Direction:** Only English → Urdu/Hindi/Chinese (not bidirectional)
6. **No Multi-turn Context:** Chat does not maintain conversation history context across turns
7. **Image Quality:** Moondream provides basic image descriptions, not detailed analysis
8. **Model Size:** Smaller models (Gemma 2B) may produce lower quality responses
9. **Installation Size:** Full installation is large (~4-6 GB) due to model weights
10. **No Cloud Sync:** Data is local-only with no backup/sync mechanism

---

## 16. Future Work

1. **Bidirectional Translation:** Support Urdu/Hindi/Chinese → English translation
2. **Multi-turn Context:** Maintain conversation history for contextual responses
3. **Urdu/Hindi STT:** Add speech recognition models for Urdu and Hindi
4. **Urdu TTS:** Add Urdu voice model for text-to-speech
5. **macOS and Linux Support:** Cross-platform packaging
6. **RAG Integration:** Retrieval-Augmented Generation for document-based Q&A
7. **Model Fine-tuning:** Fine-tune models on domain-specific data
8. **Cloud Backup (Optional):** Encrypted optional cloud sync for chat history
9. **Plugin System:** Allow third-party extensions and tools
10. **GPU Acceleration:** Leverage CUDA/Metal for faster model inference
11. **Streaming Translation:** Translate tokens as they stream instead of post-translation
12. **Conversation Search:** Full-text search across all conversation history
13. **Multi-user Profiles:** Support multiple user profiles on the same machine
14. **Agent Mode:** Allow the AI to perform actions (file operations, web search when online)

---

## 17. Conclusion

Nexa demonstrates that a capable, feature-rich AI assistant can operate entirely offline on consumer hardware. By integrating open-source language models, speech recognition, text-to-speech, translation, document processing, and code execution into a single desktop application, Nexa provides a privacy-first alternative to cloud-based AI assistants.

The project showcases the viability of local AI deployment for privacy-sensitive use cases and contributes to the growing ecosystem of offline-first AI tools. With continued development in open-source model quality and hardware capabilities, applications like Nexa will become increasingly capable while maintaining the fundamental promise: **your data stays on your machine.**

---

## 18. References

1. Ollama — Local LLM Inference Engine. https://ollama.com
2. FastAPI — Modern Python Web Framework. https://fastapi.tiangolo.com
3. Electron — Desktop Application Framework. https://www.electronjs.org
4. React — JavaScript UI Library. https://react.dev
5. Vosk — Offline Speech Recognition. https://alphacephei.com/vosk
6. Piper — Neural Text-to-Speech. https://github.com/rhasspy/piper
7. Argos Translate — Open Source Translation. https://github.com/argosopentech/argos-translate
8. Pyodide — Python in the Browser. https://pyodide.org
9. SQLAlchemy — Python SQL Toolkit. https://www.sqlalchemy.org
10. Gemma — Open Language Model by Google. https://ai.google.dev/gemma
11. Phi-3 — Small Language Model by Microsoft. https://azure.microsoft.com/en-us/products/phi
12. Mistral 7B — Open Language Model by Mistral AI. https://mistral.ai
13. Moondream — Vision Language Model. https://github.com/vikhyat/moondream
14. SQLite — Embedded Database Engine. https://www.sqlite.org
15. Pydantic — Data Validation Library. https://docs.pydantic.dev

---

*This project was developed as part of the BS Artificial Intelligence program.*

**© 2025 Noman Rafique & Maryam Fatima. All rights reserved.**
