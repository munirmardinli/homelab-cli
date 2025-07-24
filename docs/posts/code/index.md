---
title: 🏗 Code Documentation
date:
  created: 2025-07-19
tags:
  - Code
authors:
  - Munir
status: true
robots: index, follow
visibility: true
slug: code
comments: true
description: >
  Technical reference for the `src` directory structure, modules, and key functionalities of the CLI tool. Designed for contributors and maintainers.
---

# 📦 Source Directory Overview (`src`)

Welcome to the technical heart of the project! This document provides a clear and concise overview of the structure and purpose of each file and folder within the `src` directory. Whether you're a new contributor or just curious, this guide will help you navigate the codebase with ease.

<!-- more -->
---

## 📑 Table of Contents
- [Main Entry Point](#main-entry-point)
- [Configuration Modules](#configuration-modules)
- [Utility Modules](#utility-modules)
- [Type Definitions](#type-definitions)

---

## 🚀 Main Entry Point

### [`index.ts`]({{ config.extra.repo_blob_url }}/src/index.ts)
The main entry script for the CLI tool. It detects the operating system (macOS or Windows) and launches the appropriate CLI logic for package management (Homebrew or Chocolatey). This file contains the main menu and delegates to the relevant platform-specific functions.

---

## ⚙️ Configuration Modules

### [`config/cli.ts`]({{ config.extra.repo_blob_url }}/src/config/cli.ts)
Defines the `PackageManagerCLI` class, which manages the interactive main menu, package installation, updates, SSH connections, and the execution of commands from YAML files. The menu adapts to the detected platform.

### [`config/localStorage.ts`]({{ config.extra.repo_blob_url }}/src/config/localStorage.ts)
Provides the `YamlDataService` class for loading and saving data (such as command lists) from YAML files in the `assets` directory. Relies on helpers from `utils/isStorage.ts`.

---

## 🛠️ Utility Modules

### [`utils/yamlTerminalAutomator.ts`]({{ config.extra.repo_blob_url }}/src/utils/yamlTerminalAutomator.ts)
The `TerminalAutomator` class reads commands from a YAML file and executes them sequentially. Errors are logged, and execution halts on failure.

### [`utils/section.ts`]({{ config.extra.repo_blob_url }}/src/utils/section.ts)
The `Section` class provides an interactive menu for selecting and running Docker Compose files. It supports keyboard navigation and loading environment variables from `.env` files.

### [`utils/isStorage.ts`]({{ config.extra.repo_blob_url }}/src/utils/isStorage.ts)
The `isStorageService` class offers helper methods for creating directories and file paths for YAML files in the `assets` directory.

### [`utils/docker.ts`]({{ config.extra.repo_blob_url }}/src/utils/docker.ts)
The `DockerComposeUtil` class #encapsulates Docker Compose operations, including error handling and loading environment variables from `.env` files.

### [`utils/bash.ts`]({{ config.extra.repo_blob_url }}/src/utils/bash.ts)
The `BashHelper` class provides methods for establishing SSH connections and exiting the CLI program. It works seamlessly across Windows and Unix systems.

---

## 📝 Type Definitions

### [`types/types.ts`]({{ config.extra.repo_blob_url }}/src/types/types.ts)
Defines the `PackageManagerOptions` interface, which specifies configuration options for the CLI `(such as platform, commands, labels, and messages)`.
