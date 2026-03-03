import json
import os
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

PROGRESS_FILE = Path("progress.json")
DATA_DIR = Path("data")
LESSONS_DIR = DATA_DIR / "lessons"
CLAUDE_MD_DIR = DATA_DIR / "claude_md"

SEPARATOR = "─" * 50

# ANSI color codes
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
CYAN = "\033[36m"       # command hints (what to type)
GREEN = "\033[32m"      # success messages
YELLOW = "\033[33m"     # warnings, prompts
RED = "\033[31m"        # errors
BLUE = "\033[34m"       # code examples, output
MAGENTA = "\033[35m"    # section headers (## lines)

# Tracks the current working directory across commands
cwd = Path.home()


def highlight_commands_in_text(text):
    """Highlight backtick-wrapped command names in text."""
    import re
    return re.sub(r'`([^`]+)`', f'{BOLD}{CYAN}\\1{RESET}', text)


def colorize_text(text):
    """Apply colors to lesson text based on content."""
    lines = text.split("\n")
    colored = []

    for line in lines:
        if line.startswith("## "):
            colored.append(f"\n{BOLD}{MAGENTA}{line}{RESET}")
        elif line.startswith("    ") and line.strip():
            # Indented code/command examples in lesson text
            colored.append(f"{CYAN}{line}{RESET}")
        elif line.startswith("- "):
            colored.append(f"{DIM}{highlight_commands_in_text(line)}{RESET}")
        elif line.startswith("⚠"):
            colored.append(f"{BOLD}{RED}{line}{RESET}")
        else:
            colored.append(highlight_commands_in_text(line))

    return "\n".join(colored)


def load_progress():
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {
        "current_lesson": 0,
        "completed": [],
        "started_at": datetime.now().isoformat(),
        "project_dir": None,
    }


def save_progress(progress):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def load_lesson(lesson_number):
    lesson_file = LESSONS_DIR / f"lesson_{lesson_number}.json"
    return json.loads(lesson_file.read_text())


def run_command(command, interactive=False):
    """Execute a shell command and return output."""
    global cwd

    # Handle cd specially — it changes state in the parent process
    stripped = command.strip()
    if stripped == "cd" or stripped.startswith("cd "):
        parts = stripped.split(None, 1)
        target = parts[1] if len(parts) > 1 else str(Path.home())
        target = target.replace("~", str(Path.home()))
        try:
            new_dir = Path(target) if target.startswith("/") else cwd / target
            new_dir = new_dir.resolve()
            if new_dir.is_dir():
                cwd = new_dir
                return ""
            else:
                return f"cd: no such file or directory: {target}"
        except Exception as e:
            return f"cd: {e}"

    if interactive:
        # Hand off to real terminal for interactive commands
        subprocess.run(command, shell=True, cwd=str(cwd))
        return None

    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=10,
        )
        output = result.stdout
        if result.stderr:
            output += result.stderr
        return output.rstrip()
    except subprocess.TimeoutExpired:
        return "(command timed out)"
    except Exception as e:
        return f"(error: {e})"


def prompt_command(expected_command, interactive=False):
    """Show a $ prompt, only accept the expected command."""
    print(f"\n  {BOLD}{CYAN}▶ Type this and press return:{RESET}  {CYAN}{expected_command}{RESET}")
    print()

    while True:
        prompt_str = f"{DIM}{cwd}{RESET}{YELLOW}$ {RESET}"
        try:
            user_input = input(prompt_str).strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return

        if not user_input:
            continue

        if user_input != expected_command:
            print(f"  {YELLOW}Try typing: {CYAN}{expected_command}{RESET}")
            continue

        output = run_command(user_input, interactive=interactive)
        if output:
            print(f"\n{DIM}{'·' * 40}{RESET}")
            print(f"{BLUE}{output}{RESET}")
            print(f"{DIM}{'·' * 40}{RESET}")
        return


def handle_action(action, progress):
    """Handle special game actions."""
    if action == "check_claude":
        if not shutil.which("claude"):
            print(f"\n{YELLOW}⚠ Claude Code is not installed yet.{RESET}")
            print("That's okay — you won't need it until Lesson 6.")
            print("Install instructions are in the README.")
        else:
            print(f"\n{GREEN}✓ Claude Code is installed.{RESET}")

    elif action == "get_project_dir":
        print(f"\nYour current directory is: {CYAN}{cwd}{RESET}")
        use_current = input("Use this as your project directory? (y/n): ").strip().lower()
        if use_current == "y":
            progress["project_dir"] = str(cwd)
        else:
            project_dir = input("Paste the full path to your project directory: ").strip()
            progress["project_dir"] = project_dir
        print(f"{GREEN}✓ Project directory saved: {progress['project_dir']}{RESET}")
        save_progress(progress)

    elif action in ("install_claude_md_6", "install_claude_md_7"):
        project_dir = progress.get("project_dir")
        if not project_dir:
            print(f"{RED}Error: No project directory set. Complete Lesson 5 first.{RESET}")
            return False
        unit = action[-1]  # "6" or "7"
        source = CLAUDE_MD_DIR / f"unit_{unit}.md"
        dest = Path(project_dir) / "CLAUDE.md"
        shutil.copy2(source, dest)
        print(f"{GREEN}✓ CLAUDE.md for Lesson {unit} placed in {project_dir}{RESET}")

    return True


def run_lesson(lesson_number, progress):
    """Run a single lesson by stepping through its JSON steps."""
    lesson = load_lesson(lesson_number)

    clear_screen()
    print(f"{BOLD}{MAGENTA}{SEPARATOR}")
    print(f"  {lesson['title']}")
    print(f"{SEPARATOR}{RESET}")
    print()

    for i, step in enumerate(lesson["steps"]):
        text = step.get("text")
        command = step.get("command")
        action = step.get("action")
        interactive = step.get("interactive", False)

        if text:
            print(colorize_text(text))

        # Auto-run commands (game does these for the learner)
        auto_commands = step.get("auto_commands")
        if auto_commands:
            for auto_cmd in auto_commands:
                print(f"  {DIM}$ {auto_cmd}{RESET}")
                output = run_command(auto_cmd)
                if output:
                    print(f"  {DIM}{output}{RESET}")

        if action:
            result = handle_action(action, progress)
            if result is False:
                return

        if command:
            prompt_command(command, interactive=interactive)
            # Let user see the result before moving on
            if i < len(lesson["steps"]) - 1:
                input(f"\n{DIM}Press return to continue...{RESET}")
        elif not action:
            # Text-only step: wait for Enter
            input(f"\n{DIM}Press return to continue...{RESET}")

        if i < len(lesson["steps"]) - 1:
            # Visual divider between steps
            if text or action:
                print(f"\n{DIM}{SEPARATOR}{RESET}\n")

    # Lesson complete
    input("\nPress Enter to finish this lesson...")
    progress["completed"].append(lesson_number)
    progress["current_lesson"] = lesson_number + 1
    save_progress(progress)


def main():
    global cwd

    clear_screen()
    print(f"{BOLD}{CYAN}{'=' * 50}")
    print("  CLAUDZOOKS")
    print("  Learn the terminal. Build with AI.")
    print(f"{'=' * 50}{RESET}")
    print()

    progress = load_progress()
    cwd = Path.home()

    if progress["current_lesson"] > 7:
        print("You've completed all lessons! 🎉")
        print("Your web app is in:", progress.get("project_dir", "unknown"))
        return

    current = progress["current_lesson"]
    print(f"Current lesson: {current}")

    if current > 0:
        choice = input(f"Continue from Lesson {current}? (y/n): ").strip().lower()
        if choice == "n":
            print(f"Completed lessons: {progress['completed']}")
            try:
                pick = int(input("Enter lesson number to review: "))
                run_lesson(pick, progress)
            except (ValueError, FileNotFoundError):
                print("Invalid lesson number.")
            input("\nPress Enter to return to your current lesson...")
            current = progress["current_lesson"]

    for lesson_num in range(current, 8):
        run_lesson(lesson_num, progress)
        if lesson_num < 7:
            cont = input("\nReady for the next lesson? (y/n): ").strip().lower()
            if cont != "y":
                print(
                    f"\nProgress saved. Run Claudzooks again to continue from Lesson {lesson_num + 1}."
                )
                return

    print()
    print(f"{BOLD}{GREEN}{'=' * 50}")
    print("  CONGRATULATIONS!")
    print("  You built a web app using the terminal and AI.")
    print(f"{'=' * 50}{RESET}")


if __name__ == "__main__":
    main()
