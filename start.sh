#!/bin/bash
cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "Python 3 not found. Install it from python.org."
  exit 1
fi

# Check Node
if ! command -v node &>/dev/null; then
  echo "Node.js not found. Install it from nodejs.org."
  exit 1
fi

# Install JS deps if needed (one-time)
if [ ! -d "app/node_modules" ]; then
  echo "Installing dependencies (one-time setup, may take a minute)..."
  cd app && npm install && cd ..
fi

# Install Python websockets if needed
python3 -c "import websockets" 2>/dev/null || pip3 install websockets --quiet

# Start WebSocket server
python3 server/ws_server.py &
WS_PID=$!

# Start Vite dev server
cd app && npm run dev &
VITE_PID=$!
cd ..

sleep 3
xdg-open http://localhost:5173 2>/dev/null || echo "Open http://localhost:5173 in your browser"

trap "kill $WS_PID $VITE_PID 2>/dev/null" EXIT
wait $VITE_PID
