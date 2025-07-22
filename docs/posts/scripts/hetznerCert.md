---
title: 🔐 Hetzner Certificate
date:
  created: 2025-07-19
tags:
  - Script
  - SSL
  - Hetzner
  - Certificate
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: hetznerCert
description: >
  Automated SSL certificate issuance and deployment for Hetzner domains using acme.sh and Synology DSM.
comments: true
---

# 🔐 Hetzner Certificate

Automates the process of issuing and deploying SSL certificates for domains managed by Hetzner DNS using [acme.sh](https://github.com/acmesh-official/acme.sh). Supports DNS-based validation and direct deployment to Synology DSM.

<!-- more -->

## 🛠️ Service Configuration

- Loads environment variables from a `.env` file
- Installs acme.sh if not already present
- Issues wildcard SSL certificates using Hetzner DNS API
- Deploys certificates to Synology DSM
- Supports certificate renewal via cron

### Process

=== "Hetzner Certs Script"
    ```sh linenums="1"
    #!/bin/sh

    # Load environment variables
    if [ -f .env ]; then
      . ./.env # (1)
    fi
    # Install acme.sh if not present
    if ! command -v acme.sh >/dev/null 2>&1; then
      curl https://get.acme.sh | sh # (2)
      export PATH="$HOME/.acme.sh:$PATH"
    fi
    # Issue certificate
    acme.sh --issue --dns dns_hetzner -d "$DOMAIN" -d "*.$DOMAIN" --accountemail "$ACME_ACCOUNT_EMAIL" # (3)
    # Deploy to Synology DSM
    acme.sh --deploy --deploy-hook synology_dsm --domain "$DOMAIN" --home "$HOME/.acme.sh" --ecc # (4)
    # (Optional) Add to cron for renewal
    acme.sh --install-cronjob # (5)
    ```

    1. → Loads required environment variables from a `.env` file (must define `ACME_ACCOUNT_EMAIL`, `HETZNER_TOKEN`, `DOMAIN`, `SYNO_USERNAME`, `SYNO_PASSWORD`).
    2. → Installs acme.sh if it is not already available on the system.
    3. → Issues a wildcard SSL certificate for the specified domain using Hetzner DNS API.
    4. → Deploys the issued certificate directly to Synology DSM using the acme.sh deploy hook.
    5. Optional: Adds a cron job to automatically renew certificates

## 🔐 Important Notes

- Requires internet access and permissions to install software
- Synology DSM must support certificate deployment via acme.sh
- The script will attempt to renew certificates automatically if cron is enabled
- The `.env` file must be present and contain all required variables

## 🚀 Usage

```bash
sh assets/scripts/hetzner_cert.sh
```

- Ensure your `.env` file contains: `ACME_ACCOUNT_EMAIL`, `HETZNER_TOKEN`, `DOMAIN`, `SYNO_USERNAME`, `SYNO_PASSWORD`

## 🔄 Maintenance & Updates

- To manually renew certificates:
```bash
acme.sh --renew -d yourdomain.com --force
```
- To update acme.sh:
```bash
acme.sh --upgrade
```

## 🔗 References

- [acme.sh Documentation](https://github.com/acmesh-official/acme.sh)
- [Hetzner DNS API](https://dns.hetzner.com/api-docs) 
