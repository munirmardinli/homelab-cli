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
  Automated Entware installation and basic tool setup for Synology NAS systems.
comments: true
---

# 🗄️ Synology NAS Entware Setup Script (`nas.sh`)

This script automates the installation of [Entware](https://entware.net/) and basic tools (like `nano`) on Synology NAS systems. It checks for prerequisites, prepares directories, mounts the required paths, installs Entware, and configures the environment for immediate use.

<!-- more -->

---

## 📑 Features
- Checks if running on a Synology NAS
- Prepares Entware directories and mount points
- Installs Entware if not already present
- Configures shell `PATH` for Entware tools
- Installs basic tools (e.g., `nano`)
- Provides colored and timestamped log output

---

## 🚀 Usage

```bash
sh assets/scripts/nas.sh
```

- Run as a user with sufficient permissions on your Synology NAS

---

## ⚠️ Notes
- Only intended for Synology NAS systems (checks for `/volume1`)
- Will exit with an error if not run on Synology
- Adds Entware to your `~/.profile` if not already present

---

## 📂 Location
- `assets/scripts/nas.sh`

---

## 📝 Example Output
```
[2025-07-19 12:00:00] Entware successfully installed ✓
```

---

## 🔗 References
- [Entware Official Documentation](https://github.com/Entware/Entware/wiki) 
