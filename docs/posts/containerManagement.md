---
title: ❗ Container Management
date:
  created: 2025-07-19
authors:
  - Munir
tags:
  - Management
  - Infrastructure
status: true
slug: management
links:
  - 🌿 Environment: environment
  - ⚙️ Shared Config: sharedConfig
description: >
  Complete Docker Compose setup for Watchtower, Autoheal, Dashy, Roundcube, and Guacamole.
  Includes container monitoring, auto-healing, and production-ready configuration
  with health checks, logging, and monitoring integration.
---

# ❗ Container Management Tools

Production-grade container monitoring, auto-healing and dashboard solutions.

<!-- more -->

## 🛠️ Service Configuration

- Logging (`default-logging`)
- Labels (`default-labels`)
- Resource limits (`resource-limits`)

### Core Services

```yaml linenums="1" title="management.yml"
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
  container.label.group: management

x-limits: &resource-limits
  mem_limit: 256m
  mem_reservation: 64m
  cpu_shares: "512"
  restart: always
  networks:
    dockerization:

services:
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    hostname: watchtower
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=watchtower
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (1)
      GID: ${GID_NAS_ADMIN:-100} # (2)
      WATCHTOWER_CLEANUP: true # (3)
      WATCHTOWER_LABEL_ENABLE: true # (4)
      WATCHTOWER_DEBUG: true # (5)
      WATCHTOWER_ROLLING_RESTART: true # (6)
      WATCHTOWER_INCLUDE_STOPPED: true # (7)
      NO_COLOR: 1 # (8)
      WATCHTOWER_NO_SETUP_MESSAGE: true # (9)
      WATCHTOWER_TIMEOUT: 30s # (10)
      WATCHTOWER_NO_RESTART: false # (11)
      WATCHTOWER_POLL_INTERVAL: 30 # (12)
      WATCHTOWER_HTTP_API_UPDATE: true # (13)
      WATCHTOWER_HTTP_API_METRICS: true # (14)
      WATCHTOWER_HTTP_API_PERIODIC_POLLS: true # (15)
      DOCKER_TLS_VERIFY: true # (16)
      WATCHTOWER_LOG_LEVEL: info # (17)
      DOCKER_API_VERSION: 1.41 # (18)
      WATCHTOWER_REMOVE_VOLUMES: false # (19)
      WATCHTOWER_TRACE: true # (20)
      WATCHTOWER_HTTP_API_TOKEN: ${WATCHTOWER_HTTP_API_TOKEN:? Token is missing} # (21)
    ports:
      - target: 8080
        published: 8080
        protocol: tcp
        mode: host
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
        source: /root/.docker/config.json
        target: /root/.docker/config.json
        read_only: true
    labels:
      <<: *default-labels
      monitoring: watchtower

  autoheal:
    image: willfarrell/autoheal
    container_name: autoheal
    hostname: autoheal
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=autoheal
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (22)
      GID: ${GID_NAS_ADMIN:-100} # (23)
      AUTOHEAL_INTERVAL: 60s # (24)
      AUTOHEAL_CONTAINER_LABEL: recreat.container # (25)
      DOCKER_HOST: unix:///var/run/docker.sock # (26)
      WEBHOOK_URL: https://gotify.${SYNOLOGY_BASIC_URL}/message?token=${WATCHTOWER_NOTIFICATION_GOTIFY_TOKEN} # (27)
      AUTOHEAL_ONLY_MONITOR_RUNNING: false # (28)
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
        read_only: true
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    labels:
      <<: *default-labels
      monitoring: autoheal

  dashy:
    container_name: dashy
    hostname: dashy
    image: lissy93/dashy:latest
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=dashy
    environment:
      NODE_ENV: production # (29)
    ports:
      - target: 8080
        published: 90
        protocol: tcp
        mode: host
    volumes:
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/compose/config/dashy.yml
        target: /app/user-data/conf.yml
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    labels:
      <<: *default-labels
      monitoring: dashy

networks:
  dockerization:
    external: true
```

1. User ID for permissions (default: 1026)
2. Group ID for permissions (default: 100)
3. Automatically clean up old images
4. Enable container monitoring by label
5. Enable debug mode
6. Enable rolling restarts
7. Monitor stopped containers
8. Disable colored output
9. Disable setup message
10. Container stop timeout (30s)
11. Disable container restarts (false)
12. Check interval in seconds (30)
13. Enable HTTP API updates
14. Enable metrics endpoint
15. Enable periodic polls via API
16. Enable TLS verification
17. Log level (info)
18. Docker API version (1.41)
19. Remove volumes with containers (false)
20. Enable trace logging
21. Required API token
22. User ID for permissions (default: 1026)
23. Group ID for permissions (default: 100)
24. Health check interval (60s)
25. Label to identify containers to monitor
26. Docker socket path
27. Gotify webhook URL for notifications
28. Monitor only running containers (false)
29. Environment PROD

## 🔐 Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `UID_NAS_ADMIN` | User ID for volume permissions | ⚠️ Recommended |
| `GID_NAS_ADMIN` | Group ID for volume permissions | ⚠️ Recommended |
| `WATCHTOWER_HTTP_API_TOKEN` | Watchtower API token | ✅ |
| `MOUNT_PATH_DOCKER_ROOT` | Base storage path | ✅ |
| `SYNOLOGY_BASIC_URL` | Base domain for services | ✅ |
| `DASHY_PORT` | Dashy web interface port | ⚠️ Recommended |

!!! warning "Security Notice"
    - Be stored in `.env` files
    - Have restricted permissions (`chmod 600`)
    - Never be committed to version control
    - Be rotated periodically

## 🚀 Deployment

1. Create `.env` file with required variables
2. *Initialize volumes*
```bash
mkdir -p ${MOUNT_PATH_DOCKER_ROOT}/{compose/config}
chown -R ${UID_NAS_ADMIN:-1026}:${GID_NAS_ADMIN:-100} ${MOUNT_PATH_DOCKER_ROOT}
```
3. **Start services**
```bash
docker-compose -f management.yml up -d
```

### 🔄 Maintenance

- **Updates**
```bash
docker-compose -f management.yml pull && docker-compose -f management.yml up -d
```
- **Logs**
```bash
docker-compose -f management.yml logs -f
```
