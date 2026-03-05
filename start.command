#!/bin/bash
cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &>/dev/null; then
  osascript -e 'display alert "Python 3 not found" message "Install Python 3.11+ from python.org, then try again."'
  exit 1
fi

# Check Node
if ! command -v node &>/dev/null; then
  osascript -e 'display alert "Node.js not found" message "Install Node.js from nodejs.org, then try again."'
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

# Wait for Vite to be ready, then open browser
sleep 3
open http://localhost:5173

# On exit, kill both servers
trap "kill $WS_PID $VITE_PID 2>/dev/null" EXIT
wait $VITE_PID
