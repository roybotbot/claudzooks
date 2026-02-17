#!/bin/bash
cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed."
    echo "Install it from https://www.python.org/downloads/"
    echo "Press any key to exit."
    read -n 1
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
PYTHON_MAJOR=$(echo "$PYTHON_VERSION" | cut -d. -f1)
PYTHON_MINOR=$(echo "$PYTHON_VERSION" | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
    echo "Python 3.11 or higher is required. You have Python $PYTHON_VERSION."
    echo "Install a newer version from https://www.python.org/downloads/"
    echo "Press any key to exit."
    read -n 1
    exit 1
fi

python3 claudzooks.py
