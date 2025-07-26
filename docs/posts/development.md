---
title: 💻 Development Services
date:
  created: 2025-07-19
tags:
  - IDE
  - Version
  - Control
  - Note
  - Taking
status: true
slug: development
authors:
  - Munir
links:
  - 🌿 Environment: environment
  - ⚙️ Shared Config: sharedConfig
description: |
  Complete Docker Compose setup for Code Server, Obsidian, and GitLab CE. Includes development tools for code editing, note-taking, and version control.
---

# 💻 Development Environment Stack

Integrated development environment with code editor, version control, and knowledge management.

<!-- more -->

## 🛠️ Service Configuration

- This setup uses #the [shared Docker Compose anchors]({{ config.site_url }}sharedConfig) for:
- Logging (`default-logging`)
- Labels (`default-labels`)
- Resource limits (`resource-limits`)

### Development Services

```yaml linenums="1" title="venv.sh"
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
  container.label.group: development

x-limits: &resource-limits
  mem_limit: "256m"
  mem_reservation: "64m"
  cpu_shares: "512"
  restart: always
  networks:
    dockerization:

services:
  obsidian:
    container_name: obsidian
    hostname: obsidian
    image: ghcr.io/linuxserver/obsidian:latest
    shm_size: "5gb"
    <<: *resource-limits
    security_opt:
      - no-new-privileges:false
      - seccomp:unconfined
    healthcheck:
      test: timeout 10s bash -c ':> /dev/tcp/127.0.0.1/3000' || exit 1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 90s
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=obsidian
    ports:
      - '${OBSIDIAN_PORT:-3421}:3000'
    volumes:
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/obsidian
        target: /config
    environment:
      CUSTOM_USER: ${EMAIL} # (1)!
      PASSWORD: ${OBSIDIAN_PASSWORD} # (2)!
      UID: ${UID_NAS_ADMIN:-1026} # (3)!
      GID: ${GID_NAS_ADMIN:-100} # (4)!
    labels:
      <<: *default-labels
      monitoring: obsidian
  gitlab:
    container_name: gitlab
    hostname: "gitlab.${SYNOLOGY_BASIC_URL:?Synology URL required}"
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=gitlab
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (5)!
      GID: ${GID_NAS_ADMIN:-100} # (6)!
      GITLAB_OMNIBUS_CONFIG: | # (7)!
        external_url 'https://gitlab.${SYNOLOGY_BASIC_URL}'
        gitlab_rails['gitlab_shell_ssh_port'] = 22
        gitlab_rails['gitlab_shell_git_timeout'] = 800
        gitlab_rails['gitlab_email_enabled'] = true
        gitlab_rails['gitlab_email_from'] = '${MAIL_RECEIVER}'
        gitlab_rails['gitlab_email_display_name'] = 'Synology Gitlab'
        gitlab_rails['gitlab_email_reply_to'] = '${MAIL_RECEIVER}'
        gitlab_rails['smtp_enable'] = true
        gitlab_rails['smtp_address'] = '${SMTP_HOST:-smtp.mail.me.com}'
        gitlab_rails['smtp_port'] = '${SMTP_PORT:-587}'
        gitlab_rails['smtp_user_name'] = '${EMAIL}'
        gitlab_rails['smtp_password'] = '${SMTP_PASSWORD}'
        gitlab_rails['smtp_domain'] = 'icloud.com'
        gitlab_rails['smtp_authentication'] = 'login'
        gitlab_rails['smtp_enable_starttls_auto'] = true
        gitlab_rails['gitlab_root_email'] = '${EMAIL}'
        gitlab_rails['lfs_enabled'] = true
        nginx['proxy_connect_timeout'] = 300
        nginx['proxy_read_timeout'] = 3600
        registry['enable'] = true
        registry_external_url 'https://gitlab.${SYNOLOGY_BASIC_URL}:${GITLAB_REGISTRY:-5005}'
    ports:
      - "${GITLAB_HTTPS:-5100}:443" # (8)!
      - "${GITLAB_REGISTRY:-5101}:5005" # (9)!
      - "${GITLAB_SSH:-5102}:22" # (10)!
    volumes:
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/gitlab/config
        target: /etc/gitlab
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/logs/gitlab
        target: /var/log/gitlab
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/gitlab/data
        target: /var/opt/gitlab
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
    labels:
      <<: *default-labels
      monitoring: gitlab

  gitlab-runner:
    container_name: gitlab-runner
    hostname: gitlab-runner
    <<: *resource-limits
    logging:
      <<: *default-logging
      options:
        <<: *default-logging-options
        loki-external-labels: job=gitlab-runner
    environment:
      UID: ${UID_NAS_ADMIN:-1026} # (11)!
      GID: ${GID_NAS_ADMIN:-100} # (12)!
    volumes:
      - type: bind
        source: /etc/localtime
        target: /etc/localtime
        read_only: true
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
        read_only: true
      - type: bind
        source: ${MOUNT_PATH_DOCKER_ROOT}/gitlab/runner
        target: /etc/gitlab-runner
    labels:
      <<: *default-labels
      monitoring: gitlab-runner

networks:
  dockerization:
    external: true
```

1. → Creates Python virtual environment in `venv` folder
2. → Activates the environment using Windows path
3. → Installs all dependencies from requirements file
4. → Builds MkDocs documentation with detailed output
5. User ID for volume permissions (default: 1026)
6. Group ID for volume permissions (default: 100)
7. Base URL for GitLab instance
   SSH port for Git operations
   Git operation timeout (seconds)
   Enable email notifications
   Sender email address
   Email display name
   Reply-to email address
   Enable SMTP service
   SMTP server address
   SMTP server port
   SMTP username
   SMTP password (must be set in `.env`)
   SMTP domain
   SMTP auth method
   Enable STARTTLS
   Admin email address
   Enable Git LFS support
   Nginx connect timeout
   Nginx read timeout
   Enable container registry
   Registry external URL
8. Web UI port (default: 5100)
9. Container registry port (default: 5101)
10. Git SSH port (default: 5102)
11. User ID for volume permissions (default: 1026)
12. Group ID for volume permissions (default: 100)

## 🔐 Required Environment Variables

Refer to [Environment Variables]({{ config.site_url }}environment) documentation for:

| Variable | Description | Required |
|----------|-------------|----------|
| `SUDO_PASSWORD_VSCODE` | Code Server password | ✅ |
| `OBSIDIAN_PASSWORD` | Obsidian web interface password | ✅ |
| `SMTP_PASSWORD` | GitLab email password | ✅ |
| `MOUNT_PATH_DOCKER_ROOT` | Storage path | ✅ |
| `SYNOLOGY_BASIC_URL` | Base domain for services | ✅ |
| `UID_NAS_ADMIN` | User ID for volume permissions | ⚠️ Recommended |
| `GID_NAS_ADMIN` | Group ID for volume permissions | ⚠️ Recommended |

!!! warning "Security Notice"
    All sensitive credentials should:
    - Be stored in `.env` files
    - Have restricted permissions (`chmod 600`)
    - Never be committed to version control
    - Be rotated periodically

## 🚀 Deployment

1. Create `.env` file with required variables
2. **Initialize volumes**
```bash
mkdir -p ${MOUNT_PATH_DOCKER_ROOT}/{obsidian,gitlab/config,gitlab/data,gitlab/runner,logs/gitlab}
chown -R ${UID_NAS_ADMIN:-1026}:${GID_NAS_ADMIN:-100} ${MOUNT_PATH_DOCKER_ROOT}
```
3. **Start services**
```bash
docker-compose up -d
```
4. **Access services**
- Code Server: `https://codeserver.yourdomain.com:${CODE_SERVER:-82}`
- Obsidian: `https://yourdomain.com:${OBSIDIAN_PORT:-3421}`
- GitLab: `https://gitlab.yourdomain.com:${GITLAB_HTTPS:-5100}`

### 🔄 Maintenance

- **Backups**
	- Regularly backup all volume directories
- **Updates**
```bash
docker-compose pull && docker-compose up -d --force-recreate
```
- **Logs**
```bash
docker-compose logs -f
```
