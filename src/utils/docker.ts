import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Hilfsklasse für docker-compose Operationen im assets/docker/deployment Verzeichnis.
 */
class DockerComposeUtil {
  /**
   * Führt eine docker-compose Datei aus dem assets/docker/deployment Verzeichnis aus.
   * @param composeFileName Name der docker-compose Datei (z.B. "hosting.yml")
   * @param args Zusätzliche docker-compose Argumente (optional)
   * @param envFilePath Optionaler Pfad zu einer .env-Datei, deren Werte als Umgebungsvariablen gesetzt werden
   * @throws Fehler, falls der Befehl fehlschlägt
   */
  static run(
    composeFileName: string,
    args: string[] = ['up', '-d'],
    envFilePath?: string,
  ): void {
    const composeFilePath = path.resolve(
      process.cwd(),
      'assets',
      'docker',
      'deployment',
      composeFileName,
    );
    if (!fs.existsSync(composeFilePath)) {
      throw new Error(
        `docker-compose Datei nicht gefunden: ${composeFilePath}`,
      );
    }

    let env = { ...process.env };
    if (envFilePath) {
      const envPath = path.resolve(process.cwd(), envFilePath);
      if (!fs.existsSync(envPath)) {
        throw new Error(`.env Datei nicht gefunden: ${envPath}`);
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
      execFileSync('docker-compose', ['-f', composeFilePath, ...args], {
        stdio: 'inherit',
        env,
      });
    } catch (error) {
      throw new Error(`Fehler beim Ausführen von docker-compose: ${error}`);
    }
  }
}

export { DockerComposeUtil };
