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

# Tracks the current working directory across commands
cwd = Path.home()


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
    """Show a $ prompt, let user type a command, execute it."""
    hint = expected_command
    print(f"\n    {hint}")
    print()

    while True:
        prompt_str = f"{cwd}$ "
        try:
            user_input = input(prompt_str).strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return

        if not user_input:
            continue

        output = run_command(user_input, interactive=interactive)
        if output:
            print(output)
        return


def handle_action(action, progress):
    """Handle special game actions."""
    if action == "check_claude":
        if not shutil.which("claude"):
            print("\n⚠ Claude Code is not installed yet.")
            print("That's okay — you won't need it until Lesson 6.")
            print("Install instructions are in the README.")
        else:
            print("\n✓ Claude Code is installed.")

    elif action == "get_project_dir":
        print(f"\nYour current directory is: {cwd}")
        use_current = input("Use this as your project directory? (y/n): ").strip().lower()
        if use_current == "y":
            progress["project_dir"] = str(cwd)
        else:
            project_dir = input("Paste the full path to your project directory: ").strip()
            progress["project_dir"] = project_dir
        print(f"✓ Project directory saved: {progress['project_dir']}")
        save_progress(progress)

    elif action == "install_claude_md_6":
        project_dir = progress.get("project_dir")
        if not project_dir:
            print("Error: No project directory set. Complete Lesson 5 first.")
            return False
        source = CLAUDE_MD_DIR / "unit_6.md"
        dest = Path(project_dir) / "CLAUDE.md"
        shutil.copy2(source, dest)
        print(f"✓ CLAUDE.md for Lesson 6 placed in {project_dir}")

    elif action == "install_claude_md_7":
        project_dir = progress.get("project_dir")
        if not project_dir:
            print("Error: No project directory set. Complete Lesson 5 first.")
            return False
        source = CLAUDE_MD_DIR / "unit_7.md"
        dest = Path(project_dir) / "CLAUDE.md"
        shutil.copy2(source, dest)
        print(f"✓ CLAUDE.md for Lesson 7 placed in {project_dir}")

    return True


def run_lesson(lesson_number, progress):
    """Run a single lesson by stepping through its JSON steps."""
    lesson = load_lesson(lesson_number)

    clear_screen()
    print(SEPARATOR)
    print(f"  {lesson['title']}")
    print(SEPARATOR)
    print()

    for i, step in enumerate(lesson["steps"]):
        text = step.get("text")
        command = step.get("command")
        action = step.get("action")
        interactive = step.get("interactive", False)

        if text:
            print(text)

        if action:
            result = handle_action(action, progress)
            if result is False:
                return

        if command:
            prompt_command(command, interactive=interactive)
        elif not action:
            # Text-only step: wait for Enter
            input("\nPress Enter to continue...")

        if i < len(lesson["steps"]) - 1:
            # Visual break between steps (skip if step had no text)
            if text or action:
                print()

    # Lesson complete
    input("\nPress Enter to finish this lesson...")
    progress["completed"].append(lesson_number)
    progress["current_lesson"] = lesson_number + 1
    save_progress(progress)


def main():
    global cwd

    clear_screen()
    print("=" * 50)
    print("  CLAUDZOOKS")
    print("  Learn the terminal. Build with AI.")
    print("=" * 50)
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
    print("=" * 50)
    print("  CONGRATULATIONS!")
    print("  You built a web app using the terminal and AI.")
    print("=" * 50)


if __name__ == "__main__":
    main()
