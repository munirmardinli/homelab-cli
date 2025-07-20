---
title: 🔐 Hetzner DNS Certificate Automation Script
date:
  created: 2025-07-19
tags:
  - Script
  - SSL
  - Hetzner
  - Certificate
categories:
  - Scripts
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: hetznerCert
description: >
  Automates SSL certificate issuance and deployment for Hetzner domains using acme.sh and Synology DSM.
comments: true
---

# 🔐 Hetzner DNS Certificate Automation Script (`hetzner_cert.sh`)

This script automates the process of issuing and deploying SSL certificates for domains managed by Hetzner DNS using [acme.sh](https://github.com/acmesh-official/acme.sh). It supports DNS-based validation and can deploy certificates directly to Synology DSM.

<!-- more -->

---

## 📑 Features
- Loads environment variables from a `.env` file
- Installs acme.sh if not already present
- Issues wildcard SSL certificates using Hetzner DNS API
- Deploys certificates to Synology DSM
- Supports certificate renewal via cron

---

## 🚀 Usage

```bash
sh assets/scripts/hetzner_cert.sh
```

- Ensure your `.env` file contains the required variables: `ACME_ACCOUNT_EMAIL`, `HETZNER_TOKEN`, `DOMAIN`, `SYNO_USERNAME`, `SYNO_PASSWORD`

---

## ⚠️ Notes
- Requires internet access and permissions to install software
- Make sure your Synology DSM supports certificate deployment via acme.sh
- The script will attempt to renew certificates automatically

---

## 📂 Location
- `assets/scripts/hetzner_cert.sh`

---

## 📝 Example Output
```
Certificate successfully issued and deployed to Synology DSM.
```

---

## 🔗 References
- [acme.sh Documentation](https://github.com/acmesh-official/acme.sh)
- [Hetzner DNS API](https://dns.hetzner.com/api-docs) 
