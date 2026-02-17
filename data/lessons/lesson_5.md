# Lesson 5: Putting it together

Time to combine what you've learned. You're going to create
the project folder where you'll build your web app in Lessons 6-7.

## The task

Create this folder structure by hand, using only the terminal:

    ~/claudzooks-project/
    ├── index.html
    ├── style.css
    └── notes.txt

Step by step:

1. Go to your home directory:

    cd ~

2. Create the project folder:

    mkdir claudzooks-project

3. Go into it:

    cd claudzooks-project

4. Create the three files:

    touch index.html
    touch style.css
    touch notes.txt

5. Add starter content to index.html:

    echo "<!DOCTYPE html>" > index.html
    echo "<html><head><title>My First Web App</title></head>" >> index.html
    echo "<body><h1>Hello!</h1></body></html>" >> index.html

6. Add a note to notes.txt:

    echo "This project was created during Claudzooks Lesson 5." > notes.txt

7. Verify everything looks right:

    ls -la
    cat index.html
    cat notes.txt

8. Open index.html in your browser to see it:

    macOS:  open index.html
    Linux:  xdg-open index.html

You should see a web page that says "Hello!" — you made that
with just terminal commands.

## Before continuing

When prompted, paste the full path to your claudzooks-project folder.
(Run pwd while inside the folder to get it.)

This is where Lessons 6-7 will build your web app.
