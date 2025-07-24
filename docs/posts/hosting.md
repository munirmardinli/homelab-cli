---
title: 🔧 Core Services
date:
  created: 2025-07-19
tags:
  - Networking
  - DNS
  - Proxy
authors:
  - Munir
status: true
slug: core
links:
  - 🌿 Environment: environment
  - ⚙️ Shared Config: sharedConfig
description: >
  Complete Docker Compose setup for Cloudflare Tunnel, Pi-hole DNS, and Nginx Proxy Manager.
  Includes essential networking stack including DNS resolution, reverse proxy, and cloud tunneling.
---

# 🔧 Core Infrastructure Services

Essential networking stack including DNS resolution, reverse proxy, and cloud tunneling.

<!-- more -->

## 🛠️ Service Configuration

- This setup uses the [shared Docker Compose anchors]({{ config.site_url }}sharedConfig) for:
- Logging (`default-logging`)
- Labels (`default-labels`)
- Resource limits (`resource-limits`)

### Core Services

```yaml linenums="1" title="hosting.yml"
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
  container.label.group: hosting

x-limits: &resource-limits
  mem_limit: "256m"
  mem_reservation: "64m"
  cpu_shares: "512"
  restart: always
  networks:
    dockerization:

services:
  cloudflared:
    container_name: cloudflared
    hostname: cloudflared
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TOKEN:?CLOUDFLARE_TOKEN required}
    healthcheck:
      test: ["CMD", "cloudflared", "--version"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=cloudflared
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (1)
      GID: ${GID_NAS_ADMIN:-100} # (2)
      TUNNEL_METRICS: ${TUNNEL_METRICS:-0.0.0.0:8080} # (3)
    volumes:
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    labels:
      <<: *default-labels
      monitoring: cloudflared

  pihole:
    container_name: pihole
    hostname: pihole
    image: pihole/pihole
    cap_add:
      - NET_ADMIN
    security_opt:
      - no-new-privileges=false
    deploy:
      resources:
        limits:
          memory: 512MB
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
    healthcheck:
      test: ["CMD", "dig", "@127.0.0.1", "-p53", "pi.hole"]
      interval: 1m
      timeout: 10s
      retries: 3
      start_period: 30s
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=pihole
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (4)
      GID: ${GID_NAS_ADMIN:-100} # (5)
      FTLCONF_LOCAL_IPV4: ${FTLCONF_LOCAL_IPV4:-0.0.0.0} # (6)
      FTLCONF_LOCAL_IPV6: ${FTLCONF_LOCAL_IPV6:-::} # (7)
      PIHOLE_UID: ${PIHOLE_UID:-1000} # (8)
      PIHOLE_GID: ${PIHOLE_GID:-1000} # (9)
      DNSMASQ_USER: ${DNSMASQ_USER:-pihole} # (10)
      FTLCONF_dns_listeningMode: ${FTLCONF_dns_listeningMode:-all} # (11)
      FTLCONF_webserver_port: ${FTLCONF_webserver_port:-80} # (12)
      FTLCONF_webserver_api_password: ${PI_HOLE_PASSWORD:?Password is Missing} # (13)
      WEBTHEME: ${WEBTHEME:-dark} # (14)
      FTLCONF_dns_upstreams: ${FTLCONF_dns_upstreams:-1.1.1.1;1.0.0.1;8.8.8.8;8.8.4.4} # (15)
      FTLCONF_QUERY_LOGGING: ${FTLCONF_QUERY_LOGGING:-true} # (16)
      FTLCONF_MAXDBDAYS: ${FTLCONF_MAXDBDAYS:-30} # (17)
      FTLCONF_PRIVACYLEVEL: ${FTLCONF_PRIVACYLEVEL:-0} # (18)
      VIRTUAL_HOST: pihole.${SYNOLOGY_BASIC_URL} # (19)
    ports:
      - target: 53
        published: 53
        protocol: tcp
        mode: host
      - target: 53
        published: 53
        protocol: udp
        mode: host
      - target: 80
        published: 81
        protocol: tcp
        mode: host
    volumes:
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/config/dnsmasq.d
        target: /etc/dnsmasq.d
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/pihole
        target: /etc/pihole
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/logs/pihole
        target: /var/log/pihole
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    labels:
      <<: *default-labels
      monitoring: pihole

networks:
  dockerization:
    external: true
```

1. User ID for volume permissions (default: 1026)
2. Group ID for volume permissions (default: 100)
3. Metrics endpoint (default: 0.0.0.0:8080)
4. User ID for permissions (default: 1026)
5. Group ID for permissions (default: 100)
6. IPv4 listening address (default: 0.0.0.0)
7. IPv6 listening address (default: ::)
8. Pi-hole user ID (default: 1000)
9. Pi-hole group ID (default: 1000)
10. DNSMasq user (default: pihole)
11. DNS listening mode (default: all)
12. Web interface port (default: 80)
13. Required admin password
14. Web UI theme (default: dark)
15. Upstream DNS servers
16. Query logging (default: true)
17. Log retention (default: 30 days)
18. Privacy level (default: 0)
19. Virtual host URL

## 🔐 Required Environment Variables

Refer to [Environment Variables]({{ config.site_url }}environment) documentation for:

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDFLARE_TOKEN` | Cloudflare Tunnel token | ✅ |
| `PI_HOLE_PASSWORD` | Pi-hole admin password | ✅ |
| `INITIAL_ADMIN_PASSWORD` | NPM admin password | ✅ |
| `MOUNT_PATH_DOCKER_ROOT` | Storage path | ✅ |
| `SYNOLOGY_BASIC_URL` | Base domain for services | ✅ |
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
mkdir -p ${MOUNT_PATH_DOCKER_ROOT}/{config/dnsmasq.d,pihole,logs/pihole}
chown -R ${UID_NAS_ADMIN:-1026}:${GID_NAS_ADMIN:-100} ${MOUNT_PATH_DOCKER_ROOT}
```
3. **Start services**
```bash
docker-compose -f hosting.yml up -d
```

### 🔄 Maintenance

- **Backups**
	- Regularly backup volume directories
- **Updates**
```bash
docker-compose -f hosting.yml pull
docker-compose -f hosting.yml up -d
```
- **Logs**
```bash
docker-compose -f hosting.yml logs -f
```
