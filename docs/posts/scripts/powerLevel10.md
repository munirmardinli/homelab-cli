---
title: 🎨 Powerlevel10k Script
date:
  created: 2025-07-19
tags:
  - Script
  - Zsh
  - Theme
  - Powerlevel10k
authors:
  - Munir
status: true
slug: powerlevel10k
description: >
  Automates the setup of the Powerlevel10k Zsh theme by updating your .zshrc.
---

# 🎨 Powerlevel10k Script

This script adds the [Powerlevel10k](https://github.com/romkatv/powerlevel10k) theme to your `.zshrc` if it is not already present, and reloads your Zsh configuration. It is intended for macOS systems using Homebrew.

<!-- more -->

---

## 🛠️ Features
- Checks if Powerlevel10k is already sourced in `.zshrc`
- Appends the theme source line if missing
- Reloads `.zshrc` to apply changes immediately
- Provides user feedback in German

---

```sh linenums="1"
#!/usr/bin/env zsh

if ! grep -Fxq "source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme" ~/.zshrc; then
  echo 'source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
  echo "Powerlevel10k wurde zur .zshrc hinzugefügt." # (1)
  source ~/.zshrc
else
  echo "Powerlevel10k ist bereits in der .zshrc eingetragen."
fi
```

1. → Starts the script with Zsh (ensures Zsh is used).

## 🚀 Usage

```bash
zsh assets/scripts/powerLevel10.sh
```

- Run in a Zsh shell on macOS with Powerlevel10k installed via Homebrew

---

## ⚠️ Notes
- Only modifies `.zshrc` if the theme is not already present
- Assumes Powerlevel10k is installed at `/opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme`

---

## 🔗 References
- [Powerlevel10k Theme](https://github.com/romkatv/powerlevel10k) 
