#!/bin/bash
# start.sh — Launch Nexa backend + frontend for development (macOS/Linux)

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "🧠 Starting Nexa..."

# ── Backend ──────────────────────────────────────────────────
echo "[1/2] Starting backend..."

if [ ! -d "$BACKEND_DIR/venv" ]; then
  echo "  → Creating Python virtual environment..."
  python3 -m venv "$BACKEND_DIR/venv"
fi

source "$BACKEND_DIR/venv/bin/activate"

echo "  → Installing Python dependencies..."
pip install -r "$BACKEND_DIR/requirements.txt" -q

echo "  → Launching FastAPI backend on port 8000..."
cd "$BACKEND_DIR"
python main.py &
BACKEND_PID=$!

# ── Frontend ─────────────────────────────────────────────────
echo "[2/2] Starting frontend..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "  → Installing npm packages..."
  npm install
fi

echo "  → Launching React frontend on port 3000..."
BROWSER=none npm start &
FRONTEND_PID=$!

# ── Cleanup on exit ──────────────────────────────────────────
trap "echo '⛔ Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "✅ Nexa is running!"
echo "   Frontend → http://localhost:3000"
echo "   Backend  → http://127.0.0.1:8000"
echo "   API docs → http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop."

wait
