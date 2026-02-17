import json
import os
import shutil
from datetime import datetime
from pathlib import Path

PROGRESS_FILE = Path("progress.json")
DATA_DIR = Path("data")
LESSONS_DIR = DATA_DIR / "lessons"
CLAUDE_MD_DIR = DATA_DIR / "claude_md"


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


def print_lesson(lesson_number):
    lesson_file = LESSONS_DIR / f"lesson_{lesson_number}.md"
    print(lesson_file.read_text())


def check_claude_code_installed():
    return shutil.which("claude") is not None


def install_claude_md(unit_number, project_dir):
    source = CLAUDE_MD_DIR / f"unit_{unit_number}.md"
    dest = Path(project_dir) / "CLAUDE.md"
    shutil.copy2(source, dest)


def run_lesson(lesson_number, progress):
    clear_screen()
    print_lesson(lesson_number)

    if lesson_number == 0:
        if not check_claude_code_installed():
            print("\n⚠ Claude Code is not installed yet.")
            print("That's okay — you won't need it until Lesson 6.")
            print("Install instructions are in the README.")
        else:
            print("\n✓ Claude Code is installed.")

    if lesson_number == 5:
        project_dir = input(
            "\nPaste the full path to the project directory you just created: "
        ).strip()
        progress["project_dir"] = project_dir

    if lesson_number in (6, 7):
        project_dir = progress.get("project_dir")
        if not project_dir:
            print("Error: No project directory set. Complete Lesson 5 first.")
            return
        install_claude_md(lesson_number, project_dir)
        print(
            f"\n✓ CLAUDE.md for Lesson {lesson_number} has been placed in {project_dir}"
        )

    input("\nPress Enter when you've completed this lesson...")

    progress["completed"].append(lesson_number)
    progress["current_lesson"] = lesson_number + 1
    save_progress(progress)


def main():
    clear_screen()
    print("=" * 50)
    print("  CLAUDZOOKS")
    print("  Learn the terminal. Build with AI.")
    print("=" * 50)
    print()

    progress = load_progress()

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
            pick = int(input("Enter lesson number to review: "))
            print_lesson(pick)
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
