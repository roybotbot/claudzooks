# Lesson 3: Files

Folders are containers. Now let's work with the things inside them.

## Setup

Create a practice area:

    cd ~
    mkdir claudzooks-practice
    cd claudzooks-practice

## touch — create an empty file

    touch hello.txt

This creates a new, empty file called hello.txt.
Check with ls — you'll see it listed.

## echo and > — write text into a file

    echo "Hello, world!" > hello.txt

The > symbol means "send the output into this file."
It replaces whatever was in the file before.

## cat — read a file

    cat hello.txt

This prints the file's contents to the screen.
You should see: Hello, world!

## >> — append to a file

    echo "This is my second line." >> hello.txt

Two arrows (>>) means "add to the end" instead of replacing.
Run cat hello.txt again — you'll see both lines.

## cp — copy a file

    cp hello.txt backup.txt

Now you have two files with the same content.
Confirm with ls and cat backup.txt.

## mv — move or rename a file

Rename backup.txt:

    mv backup.txt archive.txt

Check with ls — backup.txt is gone, archive.txt is there.

mv also moves files between folders:

    mkdir subfolder
    mv archive.txt subfolder/

Now archive.txt is inside subfolder/.
Check: ls subfolder/

## rm — delete a file

    rm hello.txt

Gone. No trash can, no undo. rm is permanent.

## rm -r — delete a folder and everything in it

    rm -r subfolder

This removes subfolder and the archive.txt inside it.
Be careful with rm -r. Double-check what you're deleting.

## What you learned
- touch creates empty files
- echo "text" > file writes to a file (overwrites)
- echo "text" >> file appends to a file
- cat prints file contents
- cp copies files
- mv moves or renames files
- rm deletes files permanently
- rm -r deletes folders and their contents
