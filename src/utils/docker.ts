import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Hilfsklasse für docker-compose Operationen im assets/docker/deployment Verzeichnis.
 */
class DockerComposeUtil {
  private static readonly DOCKER_CLI_PATH = 'docker-compose';
  private static readonly ENV_PATH_DIRECTORY = process.cwd();
  private static readonly CATCH_ERROR =
    'Fehler beim Ausführen von docker-compose:';
  private static readonly DOTENV_NOTFOUND = '.env Datei nicht gefunden:';
  private static readonly DOCKER_COMPOSE_NOT_FOUND =
    'docker-compose Datei nicht gefunden:';
  private static readonly DEPLOYMENT_DIR = ['assets', 'docker', 'deployment'];
  private static readonly DEFAULT_COMPOSE_ARGS = ['up', '-d'];
  private static readonly DEFAULT_STADIO_MODE = 'inherit';

  /**
   * Führt eine docker-compose Datei aus dem assets/docker/deployment Verzeichnis aus.
   * @param composeFileName Name der docker-compose Datei (z.B. "hosting.yml")
   * @param args Zusätzliche docker-compose Argumente (optional)
   * @param envFilePath Optionaler Pfad zu einer .env-Datei, deren Werte als Umgebungsvariablen gesetzt werden
   * @throws Fehler, falls der Befehl fehlschlägt
   */
  static run(
    composeFileName: string,
    args: string[] = this.DEFAULT_COMPOSE_ARGS,
    envFilePath?: string,
  ): void {
    const composeFilePath = path.resolve(
      this.ENV_PATH_DIRECTORY,
      ...this.DEPLOYMENT_DIR,
      composeFileName,
    );
    if (!fs.existsSync(composeFilePath)) {
      throw new Error(`${this.DOCKER_COMPOSE_NOT_FOUND}: ${composeFilePath}`);
    }

    let env = { ...process.env };
    if (envFilePath) {
      const envPath = path.resolve(this.ENV_PATH_DIRECTORY, envFilePath);
      if (!fs.existsSync(envPath)) {
        throw new Error(`${this.DOTENV_NOTFOUND}: ${envPath}`);
      }
      const envContent = fs.readFileSync(envPath, 'utf-8');
      for (const line of envContent.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) {
          continue;
        }
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
          // prettier-ignore
          (value.startsWith('\'') && value.endsWith('\'')) ||
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
      execFileSync(this.DOCKER_CLI_PATH, ['-f', composeFilePath, ...args], {
        stdio: this.DEFAULT_STADIO_MODE,
        env,
      });
    } catch (error) {
      throw new Error(`${this.CATCH_ERROR}: ${error}`);
    }
  }
}

export { DockerComposeUtil };
