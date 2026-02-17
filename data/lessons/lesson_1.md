# Lesson 1: Where am I?

Your terminal is a text-based way to interact with your computer.
Instead of clicking on folders, you type commands.

Right now, your terminal is "in" a folder on your computer,
just like a Finder or File Explorer window would be open to a folder.

## pwd — print working directory

Type this command and press Enter:

    pwd

This prints the full path of the folder you're currently in.
You'll see something like /Users/yourname or /home/yourname.

## ls — list what's here

Type this command:

    ls

This shows the files and folders inside your current folder.
You should see familiar names — Desktop, Documents, Downloads, etc.

## ls -la — list everything, with details

Type this:

    ls -la

The "-la" part is called a "flag." It modifies the command.
- "-l" means "long format" — show details like file size and date
- "-a" means "all" — include hidden files (ones starting with a dot)

You'll see a lot more items now. Files starting with a dot (like .zshrc
or .bashrc) are configuration files that are normally hidden.

## clear — clean up

Type this:

    clear

This wipes the screen. Your files haven't changed — it just clears
the visual clutter. You'll use this constantly.

## What you learned
- pwd shows where you are
- ls shows what's in the current folder
- ls -la shows everything with details
- clear cleans up the screen
