<h1 align="center">
  <br>
  🧠 Nexa — Private Offline AI Assistant
  <br>
</h1>

<p align="center">
  <strong>A fully offline, privacy-first AI desktop assistant. No cloud. No data leaks. Just AI — entirely on your machine.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows-blue?style=for-the-badge&logo=windows" />
  <img src="https://img.shields.io/badge/Electron-28.0.0-47848F?style=for-the-badge&logo=electron" />
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Ollama-Local%20LLMs-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Offline-100%25-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Privacy-First-red?style=flat-square" />
  <img src="https://img.shields.io/badge/AI%20Models-Gemma%20%7C%20Phi--3%20%7C%20Mistral-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" />
</p>

---

## 📖 Overview

**Nexa** is a fully offline, privacy-first AI assistant that runs entirely on your local machine. It provides the power of large language models (LLMs), real-time speech recognition, text-to-speech, multi-language translation, image understanding, and document analysis — all **without sending a single byte of your data to the cloud**.

Built as a Windows desktop application using **Electron + React + FastAPI + Ollama**, Nexa is designed for students, researchers, privacy-conscious users, and anyone who wants a capable AI assistant without giving up their data.

> 💡 **Your data stays on your machine. Always.**

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 💬 **Multi-Model AI Chat** | Chat with Gemma 2B, Phi-3, or Mistral 7B via Ollama. Responses stream in real-time |
| 🖼️ **Image Understanding** | Attach images and get AI-powered descriptions using the Moondream vision model |
| 🎙️ **Voice Input (STT)** | Dictate messages using real-time offline speech recognition powered by Vosk |
| 🔊 **Text-to-Speech (TTS)** | Hear AI responses read aloud using Piper's neural voice synthesis |
| 🌍 **Offline Translation** | Translate responses to **Urdu, Hindi, or Chinese** using Argos Translate |
| 📄 **Document Chat** | Upload PDFs or DOCX files and ask the AI questions about them |
| 🐍 **Python Code Runner** | Execute Python code in-browser using Pyodide (WASM) — no server required |
| 📝 **Built-in Notepad** | Create, edit, and export notes as PDF directly within the app |
| 🎨 **10 Custom Themes** | Personalize the interface with 10 carefully designed themes |
| ⌨️ **Keyboard Shortcuts** | Full keyboard navigation for power users |
| 📤 **Export Conversations** | Export your chat history as PDF or DOCX |

---

## 🏗️ System Architecture

Nexa uses a **three-tier architecture** orchestrated by an Electron shell:

```
┌────────────────────────────────────────────────────────┐
│                    ELECTRON SHELL                       │
│         Window management · IPC Bridge · Processes      │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────┐
│                  REACT FRONTEND                         │
│   Chat UI · Voice Input · Code Runner · Notes · Themes  │
│              (API calls via HTTP / SSE / WebSocket)     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────┐
│             PYTHON BACKEND (FastAPI)                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐  │
│  │  Ollama  │  │  Argos   │  │  Piper  │  │  Vosk  │  │
│  │  (LLMs)  │  │Translate │  │  (TTS)  │  │  (STT) │  │
│  └──────────┘  └──────────┘  └─────────┘  └────────┘  │
│                                                         │
│  ┌───────────────┐  ┌──────────────────────┐           │
│  │ SQLite (local)│  │ PDF / DOCX Extractor  │           │
│  └───────────────┘  └──────────────────────┘           │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### 🖥️ Desktop & Frontend
| Technology | Version | Purpose |
|---|---|---|
| Electron | 28.0.0 | Desktop shell — window, IPC, process management |
| React | 18.2.0 | UI framework |
| Pyodide | Latest | In-browser Python runtime (WebAssembly) |
| Axios | 1.15.2 | HTTP client |
| React Markdown + PrismJS | — | AI response rendering with syntax highlighting |
| jsPDF + docx | — | Export conversations to PDF and DOCX |
| Inno Setup | 6.7.1 | Custom Windows installer |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| Python 3.11+ | Backend language |
| FastAPI | Async REST API server with SSE and WebSocket support |
| SQLAlchemy + SQLite | Local persistent conversation storage |
| Uvicorn | ASGI server |
| httpx | Async HTTP client for Ollama communication |

### 🤖 AI / ML Models
| Model | Type | Purpose |
|---|---|---|
| Gemma 2B | LLM | Fast, lightweight text generation |
| Phi-3 (3.8B) | LLM | Balanced speed and quality |
| Mistral 7B | LLM | High-quality text generation |
| Moondream | Vision-Language | Image understanding and description |
| Vosk | Speech Recognition | Real-time offline voice-to-text |
| Piper (en_US-amy) | Text-to-Speech | Natural-sounding offline voice |
| Argos Translate | NMT | Offline EN → Urdu / Hindi / Chinese |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3.11+](https://www.python.org/)
- [Ollama](https://ollama.com/) — for running local LLMs

### 1. Clone the Repository

```bash
git clone https://github.com/NomanRafique01/Nexa-Offline-AI.git
cd Nexa-Offline-AI
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend will start at `http://127.0.0.1:8000`

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
npm start
```

### 4. Start the Electron Shell (Optional — for desktop mode)

```bash
cd ../electron
npm install
npm start
```

### 5. Pull AI Models via Ollama

```bash
ollama pull gemma:2b
ollama pull phi3
ollama pull mistral
ollama pull moondream
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Shift + N` | New chat |
| `Ctrl + Shift + H` | Toggle sidebar |
| `Ctrl + Shift + C` | Toggle code runner |
| `Ctrl + Shift + M` | Switch AI model |
| `Ctrl + Shift + P` | Toggle notepad |
| `Ctrl + Shift + E` | Export conversation |
| `Ctrl + Shift + K` | Show all shortcuts |

---

## 📁 Project Structure

```
nexa-offline-ai/
├── backend/               # Python FastAPI backend
│   ├── main.py            # API routes, LLM, STT, TTS, translation
│   ├── models.py          # SQLAlchemy ORM models
│   ├── database.py        # DB engine and session management
│   ├── requirements.txt   # Python dependencies
│   ├── piper/             # Piper TTS engine + voice model
│   ├── vosk-model/        # Vosk speech recognition model
│   └── argos_packages/    # Offline translation models
├── frontend/              # React frontend (Create React App)
│   └── src/
│       ├── App.js         # Main app component
│       ├── components/    # UI components (Chat, Sidebar, etc.)
│       └── services/      # API client (api.js)
├── electron/              # Electron desktop shell
│   ├── main.js            # Main process (windows, IPC, process mgmt)
│   ├── preload.js         # Context bridge
│   └── loading.html       # Splash screen
├── assets/                # App icons and images
├── docs/                  # Full project documentation
└── scripts/               # Dev utility scripts
```

---

## 🔒 Privacy & Security

Nexa is built from the ground up with privacy as the **#1 priority**:

- ✅ **Zero cloud dependency** — All AI inference runs locally via Ollama
- ✅ **No telemetry** — No usage data is ever collected or transmitted
- ✅ **Context Isolation** — Electron's security model prevents renderer access to Node.js APIs
- ✅ **Local database only** — All conversations stored in SQLite on your device
- ✅ **Offline-forced AI** — `TRANSFORMERS_OFFLINE=1` prevents any accidental model downloads
- ✅ **CORS locked** — Backend only accepts requests from `127.0.0.1`

---

## 🎨 Themes

Nexa comes with **10 built-in themes**:

| Theme | Style |
|---|---|
| 🌿 Forest | Green nature tones (default) |
| 🌙 Midnight | Dark purple/blue |
| 🏜️ Sand | Warm desert tones |
| 🌊 Ocean | Cool blue tones |
| ⚫ Carbon | Pure dark mode |
| 🌸 Blossom | Pink floral |
| 🍷 Wine | Deep red tones |
| 🌱 Sage | Muted green |
| 🦀 Rust | Warm terracotta |
| 🗡️ Blade | Cool steel gray |

---

## 🛣️ Roadmap

- [ ] Bidirectional translation (Urdu/Hindi → English)
- [ ] Multi-turn context window for conversations
- [ ] Urdu/Hindi speech recognition
- [ ] macOS and Linux support
- [ ] RAG (Retrieval-Augmented Generation) for document Q&A
- [ ] GPU acceleration (CUDA/Metal)
- [ ] Streaming translation (translate as tokens arrive)
- [ ] Full-text conversation search
- [ ] Multi-user profiles
- [ ] Agent mode (file operations, online web search)

---

## 👨‍💻 Authors

**[Noman Rafique](https://github.com/NomanRafique01)** (2k25-BSAI-06) & **Maryam Fatima** (2k25-BSAI-05)

*BS Artificial Intelligence — 2025*

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

This project stands on the shoulders of amazing open-source work:

- [Ollama](https://ollama.com) — Local LLM inference engine
- [Vosk](https://alphacephei.com/vosk) — Offline speech recognition
- [Piper](https://github.com/rhasspy/piper) — Neural text-to-speech
- [Argos Translate](https://github.com/argosopentech/argos-translate) — Open-source translation
- [Pyodide](https://pyodide.org) — Python in the browser
- [Electron](https://www.electronjs.org) — Desktop application framework
- [FastAPI](https://fastapi.tiangolo.com) — Modern Python web framework
- [Moondream](https://github.com/vikhyat/moondream) — Vision language model

---

<p align="center">
  <strong>⭐ If you find this project useful, please give it a star! ⭐</strong>
</p>
