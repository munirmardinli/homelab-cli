---
title: 🌐 Docker Macvlan
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

# 🌐 Docker Macvlan

This script interactively creates a Docker macvlan network, supporting both IPv4 and IPv6 configurations. It prompts the user for network details and executes the appropriate `docker network create` command.

<!-- more -->

## 🛠️ Service Configuration

- Interactive prompts for network name and IPv4 prefix
- Automatically constructs IPv4 subnet and gateway
- Supports both IPv4-only and dual-stack (IPv4 + IPv6) networks
- Uses `eth0` as the default parent interface and bridge mode

### Process

=== "test"
    ```sh linenums="1"
    #!/bin/bash

    read -p "Enter the Docker network name: " NETWORK_NAME # (1)
    read -p "Enter the first three parts of the IPv4 address (e.g. 10.100.0): " IP_PREFIX # (2)

    SUBNET_IPV4="${IP_PREFIX}.0/24" # (3)
    GATEWAY_IPV4="${IP_PREFIX}.254" # (4)

    echo "Select network type:"
    echo "1) IPv4 and IPv6"
    echo "2) IPv4 only"
    read -p "Selection (1 or 2): " NET_TYPE # (5)

    if [ "$NET_TYPE" = "1" ]; then
        IPV6_PREFIX="fd00::" # (6)
        SUBNET_IPV6="${IPV6_PREFIX}/64" # (7)
        docker network create -d macvlan \
          --subnet=$SUBNET_IPV4 \
          --gateway=$GATEWAY_IPV4 \
          --subnet=$SUBNET_IPV6 \
          --ipv6 \
          -o parent=eth0 \
          -o macvlan_mode=bridge \
          $NETWORK_NAME # (8)
    elif [ "$NET_TYPE" = "2" ]; then
        docker network create -d macvlan \
          --subnet=$SUBNET_IPV4 \
          --gateway=$GATEWAY_IPV4 \
          -o parent=eth0 \
          -o macvlan_mode=bridge \
          $NETWORK_NAME # (9)
    else
        echo "Invalid selection. Please restart the script."
        exit 1
    fi
    ```

    1. → Prompts for the Docker network name.
    2. → Prompts for the first three octets of the IPv4 address (e.g. 10.100.0).
    3. → Constructs the IPv4 subnet in CIDR notation (e.g. 10.100.0.0/24).
    4. → Sets the IPv4 gateway to the .254 address in the subnet.
    5. → Prompts for network type: dual-stack (IPv4+IPv6) or IPv4 only.
    6. → Uses a generic IPv6 prefix for dual-stack networks.
    7. → Constructs the IPv6 subnet in CIDR notation.
    8. → Creates a dual-stack macvlan network with both IPv4 and IPv6.
    9. → Creates an IPv4-only macvlan network.


## 🔐 Important Notes

- Requires Docker to be installed and running
- Must be run with sufficient privileges to create Docker networks
- Only `eth0` is supported as the parent interface (edit the script to change)
- The script uses bridge mode for macvlan

## 🚀 Usage

```bash
sh assets/scripts/macvlan.sh
```

- Run the script and follow the interactive prompts

## 📝 Example Output

```
Enter the Docker network name: mynet
Enter the first three parts of the IPv4 address (e.g. 10.100.0): 10.100.0
Select network type:
1) IPv4 and IPv6
2) IPv4 only
Selection (1 or 2): 1
```

## 🔄 Maintenance & Updates

- To list macvlan networks:
```bash
docker network ls | grep macvlan
```
- To remove a macvlan network:
```bash
docker network rm <network_name>
```

## 📂 Location

- `assets/scripts/macvlan.sh`

## 🔗 References

- [Docker Macvlan Networks](https://docs.docker.com/network/macvlan/) 
