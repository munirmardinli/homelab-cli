---
title: 📄 Dotenv
date:
  created: 2025-07-19
tags:
  - Dotenv
authors:
  - Munir
status: true
slug: dotenv
description: >
---

```sh linenums="1" title="dotenv.sh"
#!/bin/sh

export INFLUX_TOKEN=$(grep '^INFLUX_TOKEN=' .env | cut -d '=' -f2-)

# Dashy
export DASHY_USERNAME=$(grep '^DASHY_USERNAME=' .env | cut -d '=' -f2-)
export DASHY_PASSWORD_HASH=$(grep '^DASHY_PASSWORD_HASH=' .env | cut -d '=' -f2-)
export WEATHER_API_KEY=$(grep '^WEATHER_API_KEY=' .env | cut -d '=' -f2-)
export SYNOLOGY_BASIC_URL=$(grep '^SYNOLOGY_BASIC_URL=' .env | cut -d '=' -f2-)
```
