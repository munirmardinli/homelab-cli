import fs from "node:fs";
import path from "node:path";

/**
 * Einfacher Secrets-Parser für Umgebungsvariablen ohne externe Abhängigkeiten.
 * Liest secrets.txt oder .env Dateien und macht sie als process.env verfügbar.
 */
export class SecretsParser {
	private readonly SECRETS_FILE = "secrets.txt";
	private readonly ENV_FILE = ".env";
	private readonly UTF8_ENCODING = "utf8";

	/**
	 * Lädt Umgebungsvariablen aus secrets.txt oder .env Datei.
	 * @param filePath Optional: Spezifischer Pfad zur Secrets-Datei
	 */
	public loadSecrets(filePath?: string): void {
		const secretsPath = filePath || this.findSecretsFile();

		if (!secretsPath || !fs.existsSync(secretsPath)) {
			console.warn(`⚠️  Keine Secrets-Datei gefunden. Erstelle ${this.SECRETS_FILE} mit deinen SSH-Verbindungsdaten.`);
			return;
		}

		try {
			const content = fs.readFileSync(secretsPath, this.UTF8_ENCODING);
			this.parseSecrets(content);
			console.log(`✅ Secrets geladen aus: ${path.basename(secretsPath)}`);
		} catch (error) {
			console.error(`❌ Fehler beim Laden der Secrets-Datei:`, error);
		}
	}

	/**
	 * Sucht nach einer verfügbaren Secrets-Datei.
	 * @returns Pfad zur gefundenen Datei oder null
	 */
	private findSecretsFile(): string | null {
		const currentDir = process.cwd();
		const possibleFiles = [
			path.join(currentDir, this.SECRETS_FILE),
			path.join(currentDir, this.ENV_FILE),
			path.join(currentDir, "assets", this.SECRETS_FILE),
			path.join(currentDir, "assets", this.ENV_FILE)
		];

		for (const file of possibleFiles) {
			if (fs.existsSync(file)) {
				return file;
			}
		}

		return null;
	}

	/**
	 * Parst den Inhalt der Secrets-Datei und setzt process.env Variablen.
	 * @param content Inhalt der Secrets-Datei
	 */
	private parseSecrets(content: string): void {
		const lines = content.split('\n');

		for (const line of lines) {
			const trimmedLine = line.trim();

			// Überspringe leere Zeilen und Kommentare
			if (!trimmedLine || trimmedLine.startsWith('#')) {
				continue;
			}

			// Parse KEY=VALUE Format
			const equalIndex = trimmedLine.indexOf('=');
			if (equalIndex === -1) {
				continue;
			}

			const key = trimmedLine.substring(0, equalIndex).trim();
			const value = trimmedLine.substring(equalIndex + 1).trim();

			// Entferne Anführungszeichen falls vorhanden
			const cleanValue = value.replace(/^["']|["']$/g, '');

			// Setze die Umgebungsvariable
			process.env[key] = cleanValue;
		}
	}

	/**
	 * Erstellt eine Beispiel-Secrets-Datei.
	 * @param filePath Pfad zur Secrets-Datei (optional)
	 */
	public createExampleSecrets(filePath?: string): void {
		const secretsPath = filePath || path.join(process.cwd(), this.SECRETS_FILE);
		const exampleContent = `# SSH-Verbindungsdaten für homelab-cli
# Entferne die # Zeichen und fülle deine Daten ein

# macOS/Darwin SSH-Verbindung
#DARWIN_USERNAME=dein_username
#DARWIN_HOST=dein_host

# Windows SSH-Verbindung  
#WINDOWS_USERNAME=dein_username
#WINDOWS_HOST=dein_host

# NAS SSH-Verbindung
#NAS_USERNAME=dein_username
#NAS_HOST=dein_host
#NAS_PORT=22

# Beispiel für aktive Konfiguration:
#DARWIN_USERNAME=admin
#DARWIN_HOST=192.168.1.100
#WINDOWS_USERNAME=user
#WINDOWS_HOST=192.168.1.101
#NAS_USERNAME=nasuser
#NAS_HOST=192.168.1.102
#NAS_PORT=2222`;

		try {
			fs.writeFileSync(secretsPath, exampleContent, this.UTF8_ENCODING);
			console.log(`📝 Beispiel-Secrets-Datei erstellt: ${secretsPath}`);
			console.log(`   Bearbeite die Datei und entferne die # Zeichen vor deinen Daten.`);
		} catch (error) {
			console.error(`❌ Fehler beim Erstellen der Beispiel-Secrets-Datei:`, error);
		}
	}
}
