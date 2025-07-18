import fs from 'node:fs';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline';

import { DockerComposeUtil } from './docker.js';

/**
 * Section Utility für interaktive Auswahl und Steuerung von DockerComposeUtil.
 */
export class Section {
  private static readonly DEFAULT_DOCKER_COMPOSE_DIRECTORY = path.resolve(
    process.cwd(),
    'assets',
    'docker',
    'deployment',
  );
  private static readonly NOT_FOUND_FILE_ERROR =
    'Keine docker-compose Dateien im Verzeichnis gefunden:';
  private static readonly DEFAULT_POSTFIX = '.yml';
  private static readonly DEFAULT_ENV_FILE = '.env';
  private static readonly SUCCESS_MESSAGE =
    'docker-compose erfolgreich ausgeführt!';
  private static readonly NAVIGATION =
    'Wähle eine docker-compose Datei mit ↑/↓ und Enter:\n\n';
  private static readonly DEFAULT_COMPOSE_ARGS = ['up', '-d'];
  private static readonly INPUT_ENV_FILE =
    'Name der .env Datei im Projektverzeichnis (Enter für Standard:';

  private static files: string[] = [];
  private static selected: number = 0;

  private static renderMenu() {
    output.write('\x1Bc');
    output.write(this.NAVIGATION);
    for (const [idx, file] of this.files.entries()) {
      if (idx === this.selected) {
        output.write(`> ${file} <\n`);
      } else {
        output.write(`  ${file}\n`);
      }
    }
  }

  private static keypressListener(
    key: string,
    resolve: () => void,
    defaultEnvFile: string,
  ) {
    if (key === '\u0003') {
      output.write('\nAbbruch.\n');
      process.exit();
    } else if (key === '\r' || key === '\n') {
      input.setRawMode(false);
      input.pause();
      output.write(`\nAusgewählt: ${this.files[this.selected]}\n`);
      input.removeListener('data', this.keypressListenerWrapper);
      this.askEnvAndRun(String(this.files[this.selected]), defaultEnvFile);
      resolve();
    } else if (key === '\u001b[A') {
      this.selected =
        (this.selected - 1 + this.files.length) % this.files.length;
      this.renderMenu();
    } else if (key === '\u001b[B') {
      this.selected = (this.selected + 1) % this.files.length;
      this.renderMenu();
    }
  }

  private static keypressListenerWrapper: (key: string) => void;

  static async promptAndRun(defaultEnvFile = this.DEFAULT_ENV_FILE) {
    this.files = fs
      .readdirSync(this.DEFAULT_DOCKER_COMPOSE_DIRECTORY)
      .filter((f) => f.endsWith(this.DEFAULT_POSTFIX) || f.endsWith('.yaml'));
    if (this.files.length === 0) {
      console.error(
        this.NOT_FOUND_FILE_ERROR,
        this.DEFAULT_DOCKER_COMPOSE_DIRECTORY,
      );
      process.exit(1);
    }
    this.selected = 0;
    this.renderMenu();
    input.setRawMode(true);
    input.resume();
    input.setEncoding('utf8');
    return new Promise<void>((resolve) => {
      this.keypressListenerWrapper = (key: string) =>
        this.keypressListener(key, resolve, defaultEnvFile);
      input.on('data', this.keypressListenerWrapper);
    });
  }

  private static askEnvAndRun(fileName: string, defaultEnvFile: string) {
    const envDir = path.resolve(process.cwd());
    const rl = readline.createInterface({ input, output });
    rl.question(`${this.INPUT_ENV_FILE} ${defaultEnvFile}): `, (envFile) => {
      rl.close();
      try {
        const envName =
          envFile && typeof envFile === 'string' && envFile.trim()
            ? envFile.trim()
            : defaultEnvFile;
        const envPath = path.join(envDir, envName);
        DockerComposeUtil.run(fileName, this.DEFAULT_COMPOSE_ARGS, envPath);
        console.log(this.SUCCESS_MESSAGE);
      } catch (err) {
        console.error('Fehler:', err);
        process.exit(1);
      }
    });
  }
}

if (process.platform === 'win32') {
  Section.promptAndRun();
}
