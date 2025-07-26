---
title: 🗄️ NAS Script
date:
  created: 2025-07-19
tags:
  - Script
  - Synology
  - NAS
  - Entware
authors:
  - Munir
status: true
slug: nas
description: >
  Automatisierte Entware-Installation und Grundkonfiguration für Synology NAS Systeme.
---

# 🗄️ NAS Script

This script automates the installation of [Entware](https://entware.net/) and basic tools (like `nano`) on Synology NAS systems. It checks prerequisites, prepares directories, mounts required paths, installs Entware, and configures the environment for immediate use.

<!-- more -->

---

## 🛠️ Service Configuration

- Checks if the script is running on a Synology NAS (verifies presence of `/volume1`)
- Creates and mounts the Entware directory (`/volume1/@Entware/opt` → `/opt`)
- Installs Entware if not present
- Adds Entware PATH to `~/.profile` if not configured
- Updates Entware package list and installs basic tools (`nano`)
- Provides color-coded, timestamped log output

---

```sh linenums="1" title="nas.sh"
#!/bin/bash

# =============================================================================
# Synology NAS Setup Script
# Installiert Entware und grundlegende Tools
# =============================================================================

set -e  # Beende bei Fehlern

# Farben für Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging-Funktion
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# =============================================================================
# 1. Voraussetzungen prüfen
# =============================================================================
log "Prüfe Voraussetzungen..." # (1)!

# Prüfe ob wir auf einem Synology NAS sind
if [ ! -d "/volume1" ]; then
    error "Dieses Skript ist nur für Synology NAS-Systeme gedacht!"
    exit 1
fi

# Prüfe Container Manager Verzeichnis
if [ ! -d "/volume1/@appconf/ContainerManager" ]; then
    warning "Container Manager Verzeichnis nicht gefunden"
fi

# =============================================================================
# 2. Entware Verzeichnis vorbereiten
# =============================================================================
log "Bereite Entware Verzeichnis vor..." # (2)!

ENTWARE_DIR="/volume1/@Entware"
OPT_DIR="$ENTWARE_DIR/opt"

# Erstelle Verzeichnisse
if [ ! -d "$ENTWARE_DIR" ]; then
    log "Erstelle Entware Hauptverzeichnis..."
    mkdir -p "$ENTWARE_DIR"
fi

if [ ! -d "$OPT_DIR" ]; then
    log "Erstelle opt Verzeichnis..."
    mkdir -p "$OPT_DIR"
fi

# =============================================================================
# 3. Mount-Point einrichten
# =============================================================================
log "Richte Mount-Point ein..." # (3)!

# Prüfe ob bereits gemountet
if ! mountpoint -q /opt; then
    log "Mounte Entware opt Verzeichnis..."
    mount -o bind "$OPT_DIR" /opt
else
    warning "/opt ist bereits gemountet"
fi

# Symlink erstellen (falls nicht vorhanden)
if [ ! -L "/opt" ]; then
    log "Erstelle Symlink..."
    ln -sf "$OPT_DIR" /opt
fi

# =============================================================================
# 4. Entware installieren
# =============================================================================
log "Installiere Entware..." # (4)!

# Prüfe ob Entware bereits installiert ist
if [ ! -f "/opt/bin/opkg" ]; then
    log "Lade Entware Installer herunter..."
    wget -O - https://bin.entware.net/x64-k3.2/installer/generic.sh | /bin/sh
else
    warning "Entware scheint bereits installiert zu sein"
fi

# =============================================================================
# 5. System-Informationen anzeigen
# =============================================================================
log "System-Informationen:" # (5)!
echo "Architektur: $(uname -m)"
echo "CPU-Info:"
cat /proc/cpuinfo | grep "model name" | head -1

# =============================================================================
# 6. PATH konfigurieren
# =============================================================================
log "Konfiguriere PATH..." # (6)!

# Prüfe ob PATH bereits konfiguriert ist
if ! grep -q "/opt/bin:/opt/sbin" ~/.profile; then
    log "Füge Entware PATH zu .profile hinzu..."
    echo 'export PATH=/opt/bin:/opt/sbin:$PATH' >> ~/.profile
else
    warning "PATH bereits in .profile konfiguriert"
fi

# PATH für aktuelle Session setzen
export PATH=/opt/bin:/opt/sbin:$PATH

# =============================================================================
# 7. Entware aktualisieren und Tools installieren
# =============================================================================
log "Aktualisiere Entware Paketliste..." # (7)!
opkg update

log "Installiere nano..."
opkg install nano

# =============================================================================
# 8. Abschluss
# =============================================================================
log "Installation abgeschlossen!"
log "Führe 'source ~/.profile' aus oder starte eine neue Shell-Session"
log "Verfügbare Befehle: opkg, nano"

# Teste Installation
if command -v opkg >/dev/null 2>&1; then
    log "Entware erfolgreich installiert ✓"
else
    error "Entware Installation fehlgeschlagen!"
    exit 1
fi
```

1. Verifies the script is running on a Synology NAS
2. Creates the Entware directory structure
3. Binds the opt directory to /opt and creates symlink if needed
4. Installs Entware if not present
5. Adds Entware PATH to ~/.profile and sets it for current session
6. Updates package list and installs nano
7. Verifies successful installation

## 🔐 Important Notes

- Only for Synology NAS systems (checks for /volume1)
- Must be executed with sufficient privileges
- Only adds PATH if not already configured
- After installation, start a new shell session or run source ~/.profile

## 🚀 Usage

```bash
sh assets/scripts/nas.sh
```

## 🔗 References

- [Entware Offizielle Dokumentation](https://github.com/Entware/Entware/wiki) 
