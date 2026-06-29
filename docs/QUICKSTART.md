# ⚡ Nexa Quick Start Guide

Get Nexa running in under 5 minutes.

---

## Prerequisites

Install these before anything else:

| Tool | Version | Download |
|---|---|---|
| Node.js | v18+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| Ollama | Latest | https://ollama.com |

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/NomanRafique01/Nexa-Offline-AI.git
cd Nexa-Offline-AI
```

---

## Step 2 — Start the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python main.py
```

Backend runs at `http://127.0.0.1:8000`

---

## Step 3 — Start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

## Step 4 — Start Electron (desktop mode)

Open another terminal:

```bash
cd electron
npm install
npm start
```

---

## Step 5 — Pull AI models

```bash
ollama pull gemma:2b       # Fast, lightweight
ollama pull phi3           # Balanced
ollama pull mistral        # Best quality
ollama pull moondream      # Image understanding
```

> 💡 You only need **one** model to get started. `gemma:2b` is the fastest.

---

## Quick Dev Start (all-in-one)

Instead of steps 2–3 separately, run:

```bash
cd scripts
node dev-start.js
```

This launches both backend and frontend together in the background.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Backend won't start | Make sure venv is activated and `pip install -r requirements.txt` ran |
| No AI response | Run `ollama list` to confirm a model is pulled |
| Mic not working | Allow microphone access in Windows privacy settings |
| App blank screen | Wait ~10s for backend to fully load, then refresh |
