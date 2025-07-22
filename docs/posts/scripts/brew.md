---
title: 🏗 Homebrew Installation
date:
  created: 2025-07-19
  updated: 2025-07-22
tags:
  - Script
  - Homebrew
  - macOS
  - Linux
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: brew
description: >
  Automated Homebrew installation script for macOS and Linux.
comments: true
nav_order: 3
---

# 🏗 Homebrew Installation

Automated installation of [Homebrew](https://brew.sh/) on macOS and Linux. The script checks if Homebrew is already installed, installs it if necessary, and sets up the shell environment.

<!-- more -->

## 🛠️ Service Configuration

- Detects the operating system (macOS or Linux)
- Installs Homebrew if not already present
- Updates the shell profile (`.zprofile` or `.profile`)
- Skips installation if Homebrew is already installed
- Provides user feedback in German

---

```sh linenums="1"
#!/bin/sh

OS="$(uname -s)"

if [ "$OS" = "Darwin" ]; then
  if ! command -v brew >/dev/null 2>&1; then
    export HOMEBREW_NO_INSTALL_FROM_API=1 # (1)
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo >> "$HOME/.zprofile"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
    eval "$(/opt/homebrew/bin/brew shellenv)"
  else
    echo "Homebrew ist bereits installiert. Überspringe Installation."
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
elif [ "$OS" = "Linux" ]; then
  if ! command -v brew >/dev/null 2>&1; then
    export HOMEBREW_NO_INSTALL_FROM_API=1 # (2)
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo >> "$HOME/.profile"
    echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> "$HOME/.profile"
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
  else
    echo "Homebrew ist bereits installiert. Überspringe Installation."
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
  fi
else
  echo "Nicht unterstütztes Betriebssystem: $OS"
  exit 1
fi
```

1. → Prevents the use of the Homebrew API for installation and enforces the classic installation method. Recommended for compatibility and stability.
2. → The script automatically adds the Homebrew environment to the appropriate profile depending on the OS: macOS: `.zprofile`, Linux: `.profile`

## 🔐 Important Notes

- The script requires write permissions to the user's profile file
- Unsupported systems will abort with an error
- Homebrew should be available in the current terminal after installation

## 🚀 Usage

```bash
sh assets/scripts/brew.sh
```

- On macOS, `.zprofile` is updated and the Homebrew environment is loaded
- On Linux, `.profile` is updated and the Homebrew environment is loaded

## 🔄 Maintenance & Updates

- To update Homebrew:
```bash
brew update && brew upgrade
```
- To rerun the script, simply execute as described above

## 🔗 References

- [Homebrew Official Documentation](https://docs.brew.sh/)
