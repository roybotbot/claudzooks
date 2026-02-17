# Lesson 2: Moving around

Now that you know where you are and what's around you,
let's move between folders.

## cd — change directory

Type this:

    cd Desktop

Now type pwd. You'll see you're inside the Desktop folder.
Type ls to see what's on your Desktop from the terminal.

## cd .. — go up one level

Type this:

    cd ..

The two dots mean "the parent folder" — one level up.
Type pwd again to confirm you're back where you started.

## cd ~ — go home

No matter where you are, this takes you to your home folder:

    cd ~

The tilde (~) is shorthand for your home directory.
You'll see it used everywhere.

## Absolute vs relative paths

When you typed "cd Desktop", that was a relative path —
relative to wherever you currently were.

You can also use an absolute path, which starts from the root:

    cd /Users/yourname/Desktop

(Replace "yourname" with your actual username.)

Absolute paths start with /. Relative paths don't.

## mkdir — make a new folder

Let's create a practice folder. Go to your home directory first:

    cd ~

Now create a folder:

    mkdir practice

Check that it exists:

    ls

You should see "practice" in the list.

## Go into it and back

    cd practice
    pwd
    cd ..
    pwd

## rmdir — remove an empty folder

Let's clean up:

    rmdir practice

This only works on empty folders. We'll learn how to delete
folders with stuff in them later.

## What you learned
- cd moves you into a folder
- cd .. goes up one level
- cd ~ goes to your home folder
- Absolute paths start with /, relative paths don't
- mkdir creates a folder
- rmdir removes an empty folder
