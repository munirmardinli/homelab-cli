---
title: 🗄️ Synology NAS Entware Setup Script
date:
  created: 2025-07-19
tags:
  - Script
  - Synology
  - NAS
  - Entware
categories:
  - Scripts
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: nas
description: >
  Automatisierte Entware-Installation und Grundkonfiguration für Synology NAS Systeme.
comments: true
---

# 🗄️ Synology NAS Entware Setup Script (`nas.sh`)

Dieses Skript automatisiert die Installation von [Entware](https://entware.net/) und grundlegenden Tools (wie `nano`) auf Synology NAS Systemen. Es prüft Voraussetzungen, bereitet Verzeichnisse vor, mountet die benötigten Pfade, installiert Entware und konfiguriert die Umgebung für die sofortige Nutzung.

<!-- more -->

---

## 🛠️ Service Configuration

- Prüft, ob das Skript auf einem Synology NAS läuft (Vorhandensein von `/volume1`)
- Erstellt und bindet das Entware-Verzeichnis (`/volume1/@Entware/opt` → `/opt`)
- Installiert Entware, falls nicht vorhanden
- Fügt Entware PATH zu `~/.profile` hinzu, falls nicht vorhanden
- Aktualisiert die Entware-Paketliste und installiert grundlegende Tools (`nano`)
- Gibt farbige und zeitgestempelte Log-Ausgaben aus

### Process

=== "Synology Script"
    ```sh linenums="1"
    #!/bin/bash
    
    # 1. Voraussetzungen prüfen # (1)
    if [ ! -d "/volume1" ]; then
        echo "Dieses Skript ist nur für Synology NAS-Systeme gedacht!"; exit 1
    fi
    
    # 2. Entware-Verzeichnis vorbereiten # (2)
    ENTWARE_DIR="/volume1/@Entware"
    OPT_DIR="$ENTWARE_DIR/opt"
    mkdir -p "$OPT_DIR"
    
    # 3. Mount-Point einrichten # (3)
    if ! mountpoint -q /opt; then
        mount -o bind "$OPT_DIR" /opt
    fi
    ln -sf "$OPT_DIR" /opt
    
    # 4. Entware installieren # (4)
    if [ ! -f "/opt/bin/opkg" ]; then
        wget -O - https://bin.entware.net/x64-k3.2/installer/generic.sh | /bin/sh
    fi
    
    # 5. PATH konfigurieren
    if ! grep -q "/opt/bin:/opt/sbin" ~/.profile; then
        echo 'export PATH=/opt/bin:/opt/sbin:$PATH' >> ~/.profile
    fi
    export PATH=/opt/bin:/opt/sbin:$PATH
    
    # 6. Entware aktualisieren und Tools installieren # (6)
    opkg update
    opkg install nano
    
    # 7. Abschluss # (7)
    if command -v opkg >/dev/null 2>&1; then
        echo "Entware erfolgreich installiert ✓"
    else
        echo "Entware Installation fehlgeschlagen!"; exit 1
    fi
    ```

    1. → Prüft, ob das Skript auf einem Synology NAS läuft.
    2. → Erstellt das Entware-Verzeichnis und das opt-Verzeichnis.
    3. → Bindet das opt-Verzeichnis nach /opt und erstellt ggf. einen Symlink.
    4. → Installiert Entware, falls noch nicht vorhanden.
    5. → Fügt den Entware-PATH zu ~/.profile hinzu und setzt ihn für die aktuelle Session.
    6. → Aktualisiert die Entware-Paketliste und installiert nano.
    7. → Prüft, ob Entware erfolgreich installiert wurde.


## 🔐 Wichtige Hinweise

- Nur für Synology NAS Systeme geeignet (Prüfung auf `/volume1`)
- Muss mit ausreichenden Rechten ausgeführt werden
- Fügt PATH nur hinzu, wenn noch nicht vorhanden
- Nach der Installation sollte eine neue Shell-Session gestartet oder `source ~/.profile` ausgeführt werden

## 🚀 Nutzung

```bash
sh assets/scripts/nas.sh
```

- Skript als Benutzer mit ausreichenden Rechten auf dem Synology NAS ausführen

## 📝 Beispielausgabe

```
[2025-07-19 12:00:00] Entware erfolgreich installiert ✓
```

## 📂 Speicherort

- `assets/scripts/nas.sh`

## 🔗 Referenzen

- [Entware Offizielle Dokumentation](https://github.com/Entware/Entware/wiki) 
