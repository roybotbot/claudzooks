import { readFileSync, existsSync, statSync } from "fs"
import { join, extname } from "path"
import { spawn } from "child_process"

const PORT = 5555
const DIST_DIR = join(import.meta.dir, "app", "dist")
const sessions = new Map<unknown, string>() // ws -> cwd

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

function runCommand(command: string, cwd: string): { output: string; cwd: string } {
  const trimmed = command.trim()

  // Handle cd specially
  if (trimmed === "cd" || trimmed.startsWith("cd ")) {
    const parts = trimmed.split(/\s+/)
    const target = parts[1] || Bun.env.HOME || "/"
    const home = Bun.env.HOME || "/"
    const expanded = target === "~" ? home : target.startsWith("~/") ? home + target.slice(1) : target
    const resolved = expanded.startsWith("/")
      ? expanded
      : join(cwd, expanded)

    try {
      const real = require("path").resolve(resolved)
      if (statSync(real).isDirectory()) {
        return { output: "", cwd: real }
      }
    } catch {}
    return { output: `cd: no such file or directory: ${target}`, cwd }
  }

  try {
    const result = Bun.spawnSync(["bash", "-c", trimmed], {
      cwd,
      timeout: 10_000,
    })
    let output = result.stdout.toString().trimEnd()
    const stderr = result.stderr.toString().trimEnd()
    if (stderr) output += (output ? "\n" : "") + stderr
    return { output, cwd }
  } catch (e) {
    return { output: `(error: ${e})`, cwd }
  }
}

const server = Bun.serve({
  port: PORT,

  fetch(req) {
    const url = new URL(req.url)

    // Upgrade WebSocket requests
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) return undefined as any
      return new Response("WebSocket upgrade failed", { status: 400 })
    }

    // Serve static files from dist
    let filePath = join(DIST_DIR, url.pathname === "/" ? "index.html" : url.pathname)

    // SPA fallback: if file doesn't exist and it's not a file extension, serve index.html
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      if (!extname(url.pathname)) {
        filePath = join(DIST_DIR, "index.html")
      }
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath)
      const mime = MIME_TYPES[ext] || "application/octet-stream"
      return new Response(readFileSync(filePath), {
        headers: { "Content-Type": mime },
      })
    }

    return new Response("Not found", { status: 404 })
  },

  websocket: {
    open(ws) {
      const home = Bun.env.HOME || "/"
      sessions.set(ws, home)
      ws.send(JSON.stringify({ output: "", cwd: home, init: true }))
    },
    message(ws, message) {
      const data = JSON.parse(message.toString())
      const command = data.command || ""
      const cwd = sessions.get(ws) || "/"

      const result = runCommand(command, cwd)
      sessions.set(ws, result.cwd)
      ws.send(JSON.stringify({ output: result.output, cwd: result.cwd }))
    },
    close(ws) {
      sessions.delete(ws)
    },
  },
})

console.log(`Claudzooks running at http://localhost:${PORT}`)
