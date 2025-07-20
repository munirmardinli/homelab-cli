---
title: 🌐 Docker Macvlan Network Script
date:
  created: 2025-07-19
tags:
  - Script
  - Docker
  - Networking
categories:
  - Scripts
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: macvlan
description: >
  Interactive script to create Docker macvlan networks with IPv4 and optional IPv6 support.
comments: true
---

# 🌐 Docker Macvlan Network Script (`macvlan.sh`)

This script interactively creates a Docker macvlan network, supporting both IPv4 and IPv6 configurations. It prompts the user for network details and executes the appropriate `docker network create` command.

<!-- more -->

---

## 📑 Features
- Interactive prompts for network name and IP prefix
- Supports both IPv4-only and dual-stack (IPv4 + IPv6) networks
- Automatically constructs subnet and gateway addresses
- Uses `eth0` as the default parent interface

---

## 🚀 Usage

```bash
sh assets/scripts/macvlan.sh
```

- Follow the prompts to enter your network details

---

## ⚠️ Notes
- Requires Docker to be installed and running
- Must be run with sufficient privileges to create Docker networks
- Only `eth0` is supported as the parent interface (edit the script to change)

---

## 📂 Location
- `assets/scripts/macvlan.sh`

---

## 📝 Example Output
```
Choose network type:
1) IPv4 and IPv6
2) IPv4 only
```

---

## 🔗 References
- [Docker Macvlan Networks](https://docs.docker.com/network/macvlan/) 
