# server/ws_server.py
import asyncio
import json
import os
import subprocess
from pathlib import Path
import websockets

sessions = {}  # websocket -> cwd

async def handler(websocket):
    sessions[websocket] = Path.home()
    try:
        async for message in websocket:
            data = json.loads(message)
            command = data.get("command", "").strip()
            cwd = sessions[websocket]

            # Handle cd specially
            if command == "cd" or command.startswith("cd "):
                parts = command.split(None, 1)
                target = parts[1] if len(parts) > 1 else str(Path.home())
                target = target.replace("~", str(Path.home()))
                new_dir = Path(target) if target.startswith("/") else cwd / target
                new_dir = new_dir.resolve()
                if new_dir.is_dir():
                    sessions[websocket] = new_dir
                    await websocket.send(json.dumps({"output": "", "cwd": str(new_dir)}))
                else:
                    await websocket.send(json.dumps({"output": f"cd: no such file or directory: {target}", "cwd": str(cwd)}))
                continue

            try:
                result = subprocess.run(
                    command, shell=True, cwd=str(cwd),
                    capture_output=True, text=True, timeout=10
                )
                output = result.stdout
                if result.stderr:
                    output += result.stderr
                await websocket.send(json.dumps({"output": output.rstrip(), "cwd": str(cwd)}))
            except subprocess.TimeoutExpired:
                await websocket.send(json.dumps({"output": "(command timed out)", "cwd": str(cwd)}))
            except Exception as e:
                await websocket.send(json.dumps({"output": f"(error: {e})", "cwd": str(cwd)}))
    finally:
        del sessions[websocket]

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("WebSocket server running on ws://localhost:8765")
        await asyncio.Future()  # run forever

asyncio.run(main())
