# Lesson 6: Meet your AI pair programmer

You've been typing every command by hand. That's good — you needed
to understand what the terminal does. Now you're going to use
an AI tool called Claude Code that can write code for you,
right here in your terminal.

## What Claude Code is

Claude Code is an AI assistant that runs in your terminal.
You type instructions in plain English, and it writes code,
creates files, and runs commands. Think of it as a very fast
coworker who you need to give clear directions to.

## Starting Claude Code

Go to your project folder:

    cd ~/claudzooks-project

Now start Claude Code:

    claude

You should see Claude's interface appear in your terminal.
(If "claude" isn't recognized, go back to Lesson 0 for install steps.)

## Your first instruction

Claude Code has been set up with rules for this lesson.
It will only create HTML files in this folder, and it will
explain everything it does before doing it.

Type this to Claude:

    Replace the content of index.html with a simple web page
    that has a heading that says "Welcome to Claudzooks" and
    a paragraph underneath that says "I built this with AI."

Watch what happens. Claude will:
1. Tell you what it's about to do
2. Show you the code
3. Ask if you want to proceed
4. Write the file

After Claude is done, check the result:

    open index.html    (macOS)
    xdg-open index.html    (Linux)

## Try a few more

Ask Claude to:

    Add a second paragraph that says "This is my first project."

Then:

    Change the heading color to blue using a style tag.

Each time, Claude explains what it's doing. Read the explanations.
This is how you learn what the code means.

## Exiting Claude Code

Type:

    /exit

or press Ctrl-C to leave Claude Code and return to your normal terminal.

## What you learned
- Claude Code runs in your terminal with the "claude" command
- You give it instructions in plain English
- It explains what it's doing, then does it
- You can check the results by opening the file in a browser
