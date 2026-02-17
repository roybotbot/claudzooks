# Claudzooks v0.1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a terminal-based interactive tutorial that teaches terminal basics and Claude Code usage across 7 lessons.

**Architecture:** Single Python file (`claudzooks.py`) with lesson content in markdown files under `data/`. Launcher scripts for macOS/Linux. Progress tracked via JSON file.

**Tech Stack:** Python 3.11+ stdlib only. No external dependencies.

---

### Task 1: Create launcher scripts and README

**Files:**
- Create: `start.command`
- Create: `start.sh`
- Create: `README.md`

**Step 1: Create `start.command`**

Copy the launcher script from the spec verbatim (Python version check, then runs `python3 claudzooks.py`).

**Step 2: Create `start.sh`**

Same content as `start.command`.

**Step 3: Make both executable**

Run: `chmod +x start.command start.sh`

**Step 4: Create `README.md`**

Use the README content from the spec.

**Step 5: Commit**

```bash
git add start.command start.sh README.md
git commit -m "feat: add launcher scripts and README"
```

---

### Task 2: Create lesson content files

**Files:**
- Create: `data/lessons/lesson_0.md`
- Create: `data/lessons/lesson_1.md`
- Create: `data/lessons/lesson_2.md`
- Create: `data/lessons/lesson_3.md`
- Create: `data/lessons/lesson_4.md`
- Create: `data/lessons/lesson_5.md`
- Create: `data/lessons/lesson_6.md`
- Create: `data/lessons/lesson_7.md`

**Step 1: Create `data/lessons/` directory and all 8 lesson files**

Copy each lesson's markdown content from the spec verbatim.

**Step 2: Commit**

```bash
git add data/lessons/
git commit -m "feat: add lesson content (lessons 0-7)"
```

---

### Task 3: Create CLAUDE.md templates

**Files:**
- Create: `data/claude_md/unit_6.md`
- Create: `data/claude_md/unit_7.md`

**Step 1: Create both files**

Copy the CLAUDE.md template content from the spec verbatim.

**Step 2: Commit**

```bash
git add data/claude_md/
git commit -m "feat: add CLAUDE.md templates for lessons 6 and 7"
```

---

### Task 4: Create `claudzooks.py`

**Files:**
- Create: `claudzooks.py`

**Step 1: Implement the main game file**

Based on the pseudocode in the spec. Key functions:
- `load_progress()` / `save_progress()` — JSON progress file
- `clear_screen()` — `os.system("clear")`
- `print_lesson(n)` — read and print `data/lessons/lesson_N.md`
- `check_claude_code_installed()` — `shutil.which("claude")`
- `install_claude_md(unit, project_dir)` — copy template to project dir
- `run_lesson(n, progress)` — display lesson, handle special logic for lessons 0/5/6/7
- `main()` — welcome screen, load progress, run lesson loop

Special lesson logic:
- Lesson 0: check if Claude Code is installed, print result
- Lesson 5: prompt for project directory path, save to progress
- Lessons 6-7: copy appropriate CLAUDE.md to project dir

Refine the pseudocode into working Python but keep the same flow and simplicity. Stdlib only. No classes. Inline small functions.

**Step 2: Test manually**

Run: `python3 claudzooks.py`
Expected: Welcome screen appears, lesson 0 displays, can press Enter to advance.

**Step 3: Commit**

```bash
git add claudzooks.py
git commit -m "feat: add main game loop"
```

---

### Task 5: Final verification

**Step 1: Verify file structure matches spec**

Run: `find . -not -path './.git/*' | sort`

Expected:
```
.
./README.md
./claudzooks.py
./data
./data/claude_md
./data/claude_md/unit_6.md
./data/claude_md/unit_7.md
./data/lessons
./data/lessons/lesson_0.md
./data/lessons/lesson_1.md
./data/lessons/lesson_2.md
./data/lessons/lesson_3.md
./data/lessons/lesson_4.md
./data/lessons/lesson_5.md
./data/lessons/lesson_6.md
./data/lessons/lesson_7.md
./start.command
./start.sh
```

**Step 2: Run the game, advance through lesson 0, quit**

Run: `echo "" | python3 claudzooks.py`
Expected: No crashes.

**Step 3: Delete progress.json if created during testing**

Run: `rm -f progress.json`

**Step 4: Final commit if any cleanup needed**
