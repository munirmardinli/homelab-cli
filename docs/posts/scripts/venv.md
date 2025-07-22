---
title: 🐍 Venv Script
date:
  created: 2025-07-19
tags:
  - Script
  - Python
  - MkDocs
  - Virtualenv
categories:
  - Scripts
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: venv
description: >
  Automates Python virtual environment setup and MkDocs site build.
comments: true
---

# 🐍 Venv Script

This script automates the creation of a Python virtual environment, installs dependencies from `requirements.txt`, and builds the MkDocs documentation site. It is intended for use on Windows systems (using `venv/Scripts/activate`).

<!-- more -->

---

## 📑 Features
- Creates a Python virtual environment in the `venv` directory
- Installs dependencies from `requirements.txt`
- Builds the MkDocs documentation site with verbose output
- Installs MkDocs if not already present

## Script Code

=== "Venv"
    ```sh linenums="1"
    #!/bin/bash

    python3 -m venv venv # (1)
    source venv/Scripts/activate # (2)
    pip install -r config/requirements.txt # (3)
    mkdocs build --verbose # (4)
    ```

    1. → Creates Python virtual environment in `venv` folder
    2. → Activates the environment using Windows path
    3. → Installs all dependencies from requirements file
    4. → Builds MkDocs documentation with detailed output

---

## 🚀 Usage

```bash
sh assets/scripts/venv.sh
```

- Run in the project root directory
- Make sure `python3` and `pip` are installed

---

## ⚠️ Notes
- The script uses Windows-style activation (`venv/Scripts/activate`)
- Adjust the activation path for Unix systems if needed

---

## 🔗 References
- [Python venv Documentation](https://docs.python.org/3/library/venv.html)
- [MkDocs Documentation](https://www.mkdocs.org/) 
