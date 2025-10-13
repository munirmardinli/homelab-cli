import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Hilfsfunktionen für docker-compose Operationen im assets/docker/deployment Verzeichnis.
 */

const DOCKER_CLI_PATH = "docker-compose";
const ENV_PATH_DIRECTORY = process.cwd();
const CATCH_ERROR = "Fehler beim Ausführen von docker-compose:";
const DOTENV_NOTFOUND = ".env Datei nicht gefunden:";
const DOCKER_COMPOSE_NOT_FOUND = "docker-compose Datei nicht gefunden:";
const DEPLOYMENT_DIR = ["assets", "docker", "deployment"];
const DEFAULT_COMPOSE_ARGS = ["up", "-d"];
const DEFAULT_STADIO_MODE = "inherit";

/**
 * Führt eine docker-compose Datei aus dem assets/docker/deployment Verzeichnis aus.
 * @param composeFileName Name der docker-compose Datei (z.B. "hosting.yml")
 * @param args Zusätzliche docker-compose Argumente (optional)
 * @param envFilePath Optionaler Pfad zu einer .env-Datei, deren Werte als Umgebungsvariablen gesetzt werden
 * @throws Fehler, falls der Befehl fehlschlägt
 */
export function runDockerCompose(
	composeFileName: string,
	args: string[] = DEFAULT_COMPOSE_ARGS,
	envFilePath?: string,
): void {
	const composeFilePath = path.resolve(
		ENV_PATH_DIRECTORY,
		...DEPLOYMENT_DIR,
		composeFileName,
	);
	if (!fs.existsSync(composeFilePath)) {
		throw new Error(`${DOCKER_COMPOSE_NOT_FOUND}: ${composeFilePath}`);
	}

	const env = { ...process.env };
	if (envFilePath) {
		const envPath = path.resolve(ENV_PATH_DIRECTORY, envFilePath);
		if (!fs.existsSync(envPath)) {
			throw new Error(`${DOTENV_NOTFOUND}: ${envPath}`);
		}
		const envContent = fs.readFileSync(envPath, "utf-8");
		for (const line of envContent.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) {
				continue;
			}
			const eqIdx = trimmed.indexOf("=");
			if (eqIdx === -1) {
				continue;
			}
			const key = trimmed.slice(0, eqIdx).trim();
			let value = trimmed.slice(eqIdx + 1).trim();
			if (
				// prettier-ignore
				(value.startsWith("'") && value.endsWith("'")) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.slice(1, -1);
			}
			if (key) {
				env[key] = value;
			}
		}
	}

	try {
		execFileSync(DOCKER_CLI_PATH, ["-f", composeFilePath, ...args], {
			stdio: DEFAULT_STADIO_MODE,
			env,
		});
	} catch (error) {
		throw new Error(`${CATCH_ERROR}: ${error}`);
	}
}
