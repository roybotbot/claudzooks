# Claudzooks

Learn the terminal and build your first web app with AI.

Claudzooks is a guided, interactive terminal trainer that takes you from
"I've never opened a terminal" to "I just built a web app using an AI
coding assistant." You learn by doing — every command runs in a real
terminal, right inside the lesson.

## Requirements

- macOS or Linux
- Python 3.11 or higher

### Check if Python is installed

Open your terminal and type:

    python3 --version

If you see "Python 3.11" or higher, you're set.

If not, install Python:
- macOS: Download from https://www.python.org/downloads/
- Linux (Ubuntu/Debian): `sudo apt install python3`

### Claude Code (needed for Lessons 6-7)

You need a Claude subscription (Pro, Max, or Team) at https://claude.ai

Install Claude Code:

1. Open your terminal and run:

       curl -fsSL https://claude.ai/install.sh | bash

2. Restart your terminal (close and reopen it)

3. Verify it works:

       claude --version

## Getting started

### macOS
Double-click the `start.command` file. A terminal window will open
and the lessons will start.

If macOS says the file can't be opened because it's from an
unidentified developer: right-click the file, select "Open",
and click "Open" in the dialog.

### Linux
Open a terminal in the claudzooks folder and run:

    ./start.sh

## What you'll learn

- **Lesson 0:** Prerequisites check
- **Lesson 1:** Navigating the terminal (`pwd`, `ls`, `clear`)
- **Lesson 2:** Moving around (`cd`, `mkdir`, `rmdir`)
- **Lesson 3:** Working with files (`touch`, `echo`, `cat`, `cp`, `mv`, `rm`)
- **Lesson 4:** Reading and editing files (`head`, `tail`, `less`, `nano`)
- **Lesson 5:** Mini-project — build a project folder from scratch
- **Lesson 6:** Introduction to Claude Code
- **Lesson 7:** Build a web app with AI

## To Do Next

### Content
- Change the final project to something more interesting than a contact form
- Add Lesson 8: Claude Code best practices (how to not mess your computer up)
- Add Lesson 9: Iterating on a project with Claude (tweaking and updating)
- Improve CLAUDE.md templates to better guide beginners during AI lessons

### Features
- Automated validation (check if files exist, contents match)
- Separate reference file for Claude lessons (instructions get pushed off screen)
- Quiz/checkpoint sections before dangerous commands
- XP / progress bar / completion percentages

### Distribution
- `pip install claudzooks` packaging
- Windows support
- Unit tests
