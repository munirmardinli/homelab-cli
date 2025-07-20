---
title: 🏗 Homebrew Installation Script
date:
  created: 2025-07-19
tags:
  - Script
  - Homebrew
  - macOS
  - Linux
categories:
  - Scripts
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: brew
description: >
  Automated Homebrew installation for macOS and Linux systems.
comments: true
---

# 🏗 Homebrew Installation Script (`brew.sh`)

This script automates the installation of [Homebrew](https://brew.sh/) on both macOS and Linux systems. It checks if Homebrew is already installed and, if not, downloads and installs it using the official installation script. The script also configures the shell environment for immediate use.

<!-- more -->

---

## 📑 Features
- Detects the operating system (macOS or Linux)
- Installs Homebrew if not already present
- Updates shell profile to include Homebrew in the `PATH`
- Skips installation if Homebrew is already installed
- Provides user feedback in German

---

## 🚀 Usage

```bash
sh assets/scripts/brew.sh
```

- On macOS, updates `.zprofile` and loads Homebrew environment
- On Linux, updates `.profile` and loads Homebrew environment

---

## ⚠️ Notes
- The script must be run with a user account that has permission to modify profile files
- If your system is not supported, the script will exit with an error message

---

## 📂 Location
- `assets/scripts/brew.sh`

---

## 📝 Example Output
```
Homebrew ist bereits installiert. Überspringe Installation.
```

---

## 🔗 References
- [Homebrew Official Documentation](https://docs.brew.sh/)
