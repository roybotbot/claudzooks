#!/bin/bash
cd "$(dirname "$0")"

# Build if needed
if [ ! -d "app/dist" ]; then
  echo "Building app (one-time)..."
  ./bin/bun install --cwd app
  ./bin/bun run --cwd app build
fi

# Start server
./bin/bun server.ts &
SERVER_PID=$!

# Wait for server, then open browser
sleep 1
open http://localhost:5555

# On exit, kill server
trap "kill $SERVER_PID 2>/dev/null" EXIT
wait $SERVER_PID
