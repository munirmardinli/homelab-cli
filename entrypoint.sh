#!/bin/sh
set -e

# Ersetze Platzhalter in der Konfiguration
sed -i "s#\${DASHY_USERNAME}#${DASHY_USERNAME}#g" /app/user-data/conf.yml
sed -i "s#\${DASHY_PASSWORD_HASH}#${DASHY_PASSWORD_HASH}#g" /app/user-data/conf.yml
sed -i "s#\${WEATHER_API_KEY}#${WEATHER_API_KEY}#g" /app/user-data/conf.yml

# Originalen Befehl ausführen
exec "$@"
