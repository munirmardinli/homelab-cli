---
title: 🛡️ Authentik
date:
  created: 2025-07-19
tags:
  - Authentication
  - SSO
authors:
  - Munir
status: true
slug: authentik
links:
  - 🌿 Environment: environment
  - ⚙️ Shared Config: sharedConfig
description: >
  Complete Docker Compose setup for Authentik identity provider with PostgreSQL and Redis.
  Includes SSO, user management, multi-factor authentication, and production-ready configuration
  with health checks, logging, and monitoring integration.
---

# 🛡️ Authentik Identity Provider

Production-ready identity and access management solution with SSO, user directories, and multi-factor authentication.

<!-- more -->

## 🛠️ Service Configuration

- This setup uses the [shared Docker Compose anchors](./global/sharedConfig.md) for:
- Logging (`default-logging`)
- Labels (`default-labels`)
- Resource limits (`resource-limits`)

### Core Services

```yaml linenums="1" title="authentik.yml"
---
x-logging: &default-logging
  driver: loki
  options: &default-logging-options
    loki-url: https://loki.${SYNOLOGY_BASIC_URL}/loki/api/v1/push
    loki-retries: 5
    loki-batch-size: 400
    loki-batch-wait: 2s
    loki-timeout: 10s
    loki-max-backoff: 5s
    loki-min-backoff: 1s
    loki-tenant-id: default

x-labels: &default-labels
  com.centurylinklabs.watchtower.enable: true
  recreat.container: true
  container.label.group: proxy

x-limits: &resource-limits
  mem_limit: "256m"
  mem_reservation: "64m"
  cpu_shares: "512"
  restart: always
  networks:
    dockerization:

services:
  postgresql:
    container_name: authentik-postgresql
    hostname: authentik-postgresql
    image: docker.io/library/postgres:16-alpine
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=authentik-postgresql
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT:?path required}/authentik/database
        target: /var/lib/postgresql/data
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    environment:
      POSTGRES_PASSWORD: ${PG_PASS:?database password required} # (1)
      POSTGRES_USER: ${PG_USER:-authentik} # (2)
      POSTGRES_DB: ${PG_DB:-authentik} # (3)
      UID: ${UID_NAS_ADMIN:-1026} # (4)
      GID: ${GID_NAS_ADMIN:-100} # (5)
    labels:
      <<: *default-labels
      monitoring: authentik-postgresql

  redis:
    container_name: authentik-redis
    hostname: authentik-redis
    image: docker.io/library/redis:alpine
    command: --save 60 1 --loglevel warning
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=authentik-redis
    healthcheck:
      test:
        - CMD-SHELL
        - redis-cli ping | grep PONG
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    volumes:
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/redis
        target: /data
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (6)
      GID: ${GID_NAS_ADMIN:-100} # (7)
    labels:
      <<: *default-labels
      monitoring: authentik-redis

  authentik:
    container_name: authentik
    hostname: authentik
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.2.1}
    command: server
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=authentik
    environment:
      AUTHENTIK_REDIS__HOST: redis # (8)
      AUTHENTIK_POSTGRESQL__HOST: postgresql # (9)
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik} # (10)
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik} # (11)
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS} # (12)
      AUTHENTIK_BOOTSTRAP_EMAIL: ${EMAIL} # (13)
      AUTHENTIK_BOOTSTRAP_PASSWORD: ${AUTHENTIK_BOOTSTRAP_PASSWORD} # (14)
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY} # (15)
      UID: ${UID_NAS_ADMIN:-1026} # (16)
      GID: ${GID_NAS_ADMIN:-100} # (17)
    volumes:
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/media
        target: /media
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/templates
        target: /templates
    ports:
      - ${COMPOSE_PORT_HTTP:-9001}:9000
      - ${COMPOSE_PORT_HTTPS:-9443}:9443
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_healthy
    labels:
      <<: *default-labels
      monitoring: authentik

  worker:
    container_name: authentik-worker
    hostname: authentik-worker
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.2.1}
    command: worker
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=authentik-worker
    environment:
      AUTHENTIK_REDIS__HOST: redis # (18)
      AUTHENTIK_POSTGRESQL__HOST: postgresql # (19)
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik} # (20)
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik} # (21)
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS} # (22)
      AUTHENTIK_BOOTSTRAP_EMAIL: ${EMAIL} # (23)
      AUTHENTIK_BOOTSTRAP_PASSWORD: ${AUTHENTIK_BOOTSTRAP_PASSWORD} # (24)
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY} # (25)
      UID: ${UID_NAS_ADMIN:-1026} # (26)
      GID: ${GID_NAS_ADMIN:-100} # (27)
    user: root
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
        read_only: true
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/media
        target: /media
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/certs
        target: /certs
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/authentik/templates
        target: /templates
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_healthy
    labels:
      <<: *default-labels
      monitoring: authentik

networks:
  dockerization:
    external: true
```

1. → Required database password (must be set in `.env`)
2. → Database username (default: `authentik`)
3. → Database name (default: `authentik`)
4. → Optional user ID for volume permissions (default: 1026)
5. → Optional group ID for volume permissions (default: 100)
6. → Optional user ID for volume permissions (default: 1026)
7. Optional group ID for volume permissions (default: 100)
8. → Redis hostname (using Docker service name)
9. → PostgreSQL hostname (using Docker service name)
10. → PostgreSQL username (matches `POSTGRES_USER`)
11. → Database name (matches `POSTGRES_DB`)
12. → Must match `POSTGRES_PASSWORD`
13. → Initial admin email (must be set in `.env`)
14. → Initial admin password (must be set in `.env`)
15. → Encryption key (must be set in `.env`)
16. → User ID for volume permissions (default: 1026)
17. → Group ID for volume permissions (default: 100)
18. → Redis hostname (using Docker service name)
19. → PostgreSQL hostname (using Docker service name)
20. → PostgreSQL username (matches `POSTGRES_USER`)
21. → Database name (matches `POSTGRES_DB`)
22. → Must match `POSTGRES_PASSWORD`
23. → Initial admin email (must be set in `.env`)
24. → Initial admin password (must be set in `.env`)
25. → Encryption key (must be set in `.env`)
26. → User ID for volume permissions (default: 1026)
27. → Group ID for volume permissions (default: 100)

## 🔐 Required Environment Variables

Refer to [`Environment Variables`]({{ config.site_url }}environment) documentation for:

| Variable | Description | Required |
|----------|-------------|----------|
| `PG_PASS` | PostgreSQL password | ✅ |
| `AUTHENTIK_BOOTSTRAP_PASSWORD` | Initial admin password | ✅ |
| `AUTHENTIK_SECRET_KEY` | Encryption key | ✅ |
| `MOUNT_PATH_DOCKER_ROOT` | Storage path | ✅ |
| `UID_NAS_ADMIN` | User ID for volume permissions | ⚠️ Recommended |
| `GID_NAS_ADMIN` | Group ID for volume permissions | ⚠️ Recommended |

!!! warning "Security Notice"
    - Be stored in `.env` files
    - Have restricted permissions (`chmod 600`)
    - Never be committed to version control
    - Be rotated periodically

## 🚀 Deployment

1. Create `.env` file with required variables
2. *Initialize volumes*
```bash
mkdir -p ${MOUNT_PATH_DOCKER_ROOT}/authentik/{database,redis,media,certs,templates}
chown -R ${UID_NAS_ADMIN:-1026}:${GID_NAS_ADMIN:-100} ${MOUNT_PATH_DOCKER_ROOT}/authentik
```
3. **Start services**
```bash
docker-compose -f authentik.yml up -d
```
4. Access web UI at `https://yourdomain.com:9443`

### 🔄 Maintenance

- **Backups**
	- Regularly backup the PostgreSQL volume

- **Updates**

```bash
docker-compose -f authentik.yml pull
docker-compose -f authentik.yml up -d
```
- **Logs**
```bash
docker worker logs -f
```
