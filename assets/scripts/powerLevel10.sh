#!/usr/bin/env zsh

if ! grep -Fxq "source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme" ~/.zshrc; then
  echo 'source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
  echo "Powerlevel10k wurde zur .zshrc hinzugefügt."
  source ~/.zshrc
else
  echo "Powerlevel10k ist bereits in der .zshrc eingetragen."
fi
