# Lesson 4: Reading and editing

You can read files with cat, but for longer files you need
better tools. And eventually you need to edit files.

## Setup

    cd ~
    cd claudzooks-practice
    echo "Line 1" > longfile.txt
    echo "Line 2" >> longfile.txt
    echo "Line 3" >> longfile.txt
    echo "Line 4" >> longfile.txt
    echo "Line 5" >> longfile.txt
    echo "Line 6" >> longfile.txt
    echo "Line 7" >> longfile.txt
    echo "Line 8" >> longfile.txt
    echo "Line 9" >> longfile.txt
    echo "Line 10" >> longfile.txt

## head — see the first lines

    head longfile.txt

By default, head shows the first 10 lines. You can change that:

    head -3 longfile.txt

Shows only the first 3 lines.

## tail — see the last lines

    tail longfile.txt
    tail -3 longfile.txt

Same idea, but from the end of the file.

## less — scroll through a file

    less longfile.txt

less opens the file in a scrollable viewer.
- Arrow keys or j/k to scroll
- q to quit
- / to search (type a word and press Enter)

less is how you read files that are too long for the screen.

## nano — a simple text editor

    nano longfile.txt

nano is a text editor that runs inside your terminal.

You'll see the file contents and a menu bar at the bottom.
The ^ symbol means the Control key.

Try this:
1. Use arrow keys to move the cursor
2. Type some new text on a blank line
3. Press Control-O to save (it will ask for a filename, press Enter)
4. Press Control-X to exit

Now cat the file to see your changes:

    cat longfile.txt

nano is not fancy, but it's installed on almost every system
and you don't need to learn any special modes to use it.

## What you learned
- head shows the beginning of a file
- tail shows the end of a file
- less lets you scroll through a file (q to quit)
- nano is a simple terminal text editor (Ctrl-O save, Ctrl-X exit)
