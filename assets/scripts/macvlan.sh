#!/bin/bash

read -p "Bitte den Namen des Docker-Netzwerks eingeben: " NETWORK_NAME
read -p "Bitte die ersten drei Teile der IPv4-Adresse (z.B. 10.100.0): " IP_PREFIX

# IPv4-Subnetz und Gateway automatisch zusammensetzen
SUBNET_IPV4="${IP_PREFIX}.0/24"
GATEWAY_IPV4="${IP_PREFIX}.254"

# Auswahl: IPv4+IPv6 oder nur IPv4

echo "Wähle Netzwerk-Typ:"
echo "1) IPv4 und IPv6"
echo "2) nur IPv4"
read -p "Bitte Auswahl (1 oder 2): " NET_TYPE

if [ "$NET_TYPE" = "1" ]; then
    # Generisches IPv6-Präfix verwenden
    IPV6_PREFIX="fd00::"
    SUBNET_IPV6="${IPV6_PREFIX}/64"
    docker network create -d macvlan \
      --subnet=$SUBNET_IPV4 \
      --gateway=$GATEWAY_IPV4 \
      --subnet=$SUBNET_IPV6 \
      --ipv6 \
      -o parent=eth0 \
      -o macvlan_mode=bridge \
      $NETWORK_NAME
elif [ "$NET_TYPE" = "2" ]; then
    docker network create -d macvlan \
      --subnet=$SUBNET_IPV4 \
      --gateway=$GATEWAY_IPV4 \
      -o parent=eth0 \
      -o macvlan_mode=bridge \
      $NETWORK_NAME
else
    echo "Ungültige Auswahl. Bitte Skript erneut starten."
    exit 1
fi
