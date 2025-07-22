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

- Loads environment variables from `.env` file
- Installs and configures acme.sh
- Issues wildcard certificates via Hetzner DNS API
- Deploys certificates to Synology DSM
- Sets up automatic renewal

### Process

=== "Hetzner Certs Script"
    ```sh linenums="1"
    # Laden der Umgebungsvariablen aus der .env-Datei
    if [ -f .env ]; then # (1)
        export $(grep -v '^#' .env | xargs -d '\n')
    fi

    # Acme.sh von GitHub herunterladen und extrahieren
    wget https://github.com/acmesh-official/acme.sh/archive/master.tar.gz # (2)
    tar -xvzf master.tar.gz
    cd acme.sh-master
    ./acme.sh --install --nocron --home /usr/local/share/acme.sh --accountemail "$ACME_ACCOUNT_EMAIL"
    cd ~
    source .profile

    # Zertifikat ausstellen
    cd /usr/local/share/acme.sh # (3)
    export HETZNER_TOKEN="$HETZNER_TOKEN"
    ./acme.sh --issue --dns dns_hetzner -d "$DOMAIN" -d "*.$DOMAIN" --server letsencrypt

    # Synology Einstellungen für Anmeldung und Zertifikat
    export SYNO_USERNAME="$SYNO_USERNAME"
    export SYNO_PASSWORD="$SYNO_PASSWORD"
    export SYNO_CERTIFICATE=""

    # Zertifikat auf Synology DSM bereitstellen
    ./acme.sh --deploy --home . -d "$DOMAIN" --deploy-hook synology_dsm # (4)

    # Zertifikat ernern 

    /usr/local/share/acme.sh/acme.sh --cron --home /usr/local/share/acme.sh/ # (5)
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
