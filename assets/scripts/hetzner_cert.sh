# Laden der Umgebungsvariablen aus der .env-Datei
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs -d '\n')
fi

# Acme.sh von GitHub herunterladen und extrahieren
wget https://github.com/acmesh-official/acme.sh/archive/master.tar.gz
tar -xvzf master.tar.gz
cd acme.sh-master
./acme.sh --install --nocron --home /usr/local/share/acme.sh --accountemail "$ACME_ACCOUNT_EMAIL"
cd ~
source .profile

# Zertifikat ausstellen
cd /usr/local/share/acme.sh
export HETZNER_TOKEN="$HETZNER_TOKEN"
./acme.sh --issue --dns dns_hetzner -d "$DOMAIN" -d "*.$DOMAIN" --server letsencrypt

# Synology Einstellungen für Anmeldung und Zertifikat
export SYNO_USERNAME="$SYNO_USERNAME"
export SYNO_PASSWORD="$SYNO_PASSWORD"
export SYNO_CERTIFICATE=""

# Zertifikat auf Synology DSM bereitstellen
./acme.sh --deploy --home . -d "$DOMAIN" --deploy-hook synology_dsm

# Zertifikat ernern 

/usr/local/share/acme.sh/acme.sh --cron --home /usr/local/share/acme.sh/
