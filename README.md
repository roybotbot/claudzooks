# Claudzooks

![Claudzooks](assets/claudzooks.png)

Learn the terminal and build your first web app with AI.

## Getting Started (macOS)

1. [Download this project](https://github.com/roybotbot/claudzooks/archive/refs/heads/main.zip) and unzip it
2. Double-click `start.command`
3. If macOS blocks it: right-click → Open → Open
4. Your browser opens automatically — follow the lessons inside

That's it. No install required.

## What You'll Learn

- **Lesson 0:** Welcome
- **Lesson 1:** Navigating the terminal (`pwd`, `ls`, `clear`)
- **Lesson 2:** Moving around (`cd`, `mkdir`, `rmdir`)
- **Lesson 3:** Working with files (`touch`, `echo`, `cat`, `cp`, `mv`, `rm`)
- **Lesson 4:** Reading and editing files (`head`, `tail`, `less`, `nano`)
- **Lesson 5:** Mini-project — build a project folder from scratch
- **Lesson 6:** Introduction to Claude Code
- **Lesson 7:** Build a web app with AI

## Development

Requires [Bun](https://bun.sh).

```bash
# Install dependencies
cd app && bun install

# Start dev server (hot reload)
cd app && bun run dev

# Start command server (separate terminal)
bun server.ts

# Build for distribution
cd app && bun run build
```

The dev React app runs on `http://localhost:5173` and connects to the command server on `ws://localhost:5555/ws`. The production build is served directly by `server.ts` on port 5555.
