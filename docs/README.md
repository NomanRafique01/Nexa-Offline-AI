# 📚 Nexa Documentation

This folder contains all technical documentation for the Nexa project.

---

## Contents

| File | Description |
|---|---|
| [`QUICKSTART.md`](./QUICKSTART.md) | Get Nexa running in 5 minutes |
| [`PROJECT_REPORT.md`](./PROJECT_REPORT.md) | Full academic project report |
| [`nexa-flowchart.html`](./nexa-flowchart.html) | Interactive system architecture diagram |

---

## Architecture Overview

Nexa uses a 3-tier architecture:

```
Electron Shell
    └── React Frontend  (port 3000)
            └── FastAPI Backend  (port 8000)
                    ├── Ollama  — LLM inference
                    ├── Vosk   — Speech recognition
                    ├── Piper  — Text to speech
                    └── Argos  — Translation
```

For the full architecture diagram, open `nexa-flowchart.html` in your browser.

---

## API Reference

The backend exposes these main endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send a message, get streamed AI response |
| `POST` | `/transcribe` | Convert audio to text (Vosk STT) |
| `POST` | `/tts` | Convert text to speech (Piper) |
| `POST` | `/translate` | Translate text offline (Argos) |
| `POST` | `/vision` | Describe an image (Moondream) |
| `POST` | `/document` | Extract and query a PDF/DOCX |
| `GET`  | `/conversations` | List all saved conversations |
| `GET`  | `/health` | Backend health check |

Full API docs available at `http://127.0.0.1:8000/docs` when backend is running.
