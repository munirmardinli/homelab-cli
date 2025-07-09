#!/bin/sh

OS="$(uname -s)"

if [ "$OS" = "Darwin" ]; then
  if ! command -v brew >/dev/null 2>&1; then
    export HOMEBREW_NO_INSTALL_FROM_API=1
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
    export HOMEBREW_NO_INSTALL_FROM_API=1
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
