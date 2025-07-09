#!/bin/sh

OS="$(uname -s)"

if [ "$OS" = "Darwin" ]; then
  export HOMEBREW_NO_INSTALL_FROM_API=1
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  echo >> "$HOME/.zprofile"
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ "$OS" = "Linux" ]; then
  # Linux
  export HOMEBREW_NO_INSTALL_FROM_API=1
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  echo >> "$HOME/.profile"
  echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> "$HOME/.profile"
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
else
  echo "Nicht unterstütztes Betriebssystem: $OS"
  exit 1
fi

echo 'source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
source ~/.zshrc
