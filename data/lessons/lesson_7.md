# Lesson 7: Build something real

You're going to build a contact form. It's a single web page
with a form where someone can type their name, email, and a message.
The form won't actually send anything — it'll show a confirmation
message instead. But it will look and work like a real web page.

## Start Claude Code in your project

    cd ~/claudzooks-project
    claude

## Build the form

Give Claude this instruction:

    Build a contact form page in index.html. Requirements:
    - A heading that says "Contact Me"
    - Three form fields: Name, Email, and Message
    - Message should be a larger text area, not a single line
    - A Submit button
    - When the user clicks Submit, validate that all fields are filled in
    - If any field is empty, show a red error message below the form
    - If all fields are filled, show a green "Thanks! Message received." message
    - Hide the form after successful submission
    - All CSS should be in a <style> tag in the same file
    - All JavaScript should be in a <script> tag in the same file
    - Make it look clean and modern. Centered on the page, readable font,
      some padding and spacing.
    - Everything in one single index.html file. No external files.

## Watch and learn

Claude will build this step by step. Pay attention to:
- How HTML forms are structured
- How CSS controls the visual layout
- How JavaScript adds interactivity

If you want to understand something, ask Claude:

    Explain how the form validation works.

or:

    What does the addEventListener line do?

Claude is set up to explain things in simple terms.

## Test it

Open the page in your browser:

    open index.html    (macOS)
    xdg-open index.html    (Linux)

Try submitting with empty fields. Try submitting with everything filled.

## Make it yours

Now try customizing it. Ask Claude things like:

    Change the color scheme to dark mode.

    Add a "Phone Number" field that's optional.

    Add my name "YOUR NAME" to the heading.

Each change teaches you something about how web pages work.

## When you're done

Exit Claude Code:

    /exit

Open your final page one more time and look at it.
You built that. Using the terminal and an AI pair programmer.

## What you learned
- How to give Claude Code a detailed spec for a real page
- HTML forms: input fields, text areas, buttons
- CSS: layout, colors, fonts, spacing
- JavaScript: form validation, showing/hiding elements
- How to iterate and customize by asking for changes
