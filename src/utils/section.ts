import fs from 'node:fs';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline';

import { DockerComposeUtil } from './docker.js';

/**
 * Section Utility für interaktive Auswahl und Steuerung von DockerComposeUtil.
 */
class Section {
  static async promptAndRun(defaultEnvFile = '.env') {
    const composeDir = path.resolve(
      process.cwd(),
      'assets',
      'docker',
      'deployment',
    );
    const files = fs
      .readdirSync(composeDir)
      .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
    if (files.length === 0) {
      console.error(
        'Keine docker-compose Dateien im Verzeichnis gefunden:',
        composeDir,
      );
      process.exit(1);
    }

    let selected = 0;
    function renderMenu() {
      output.write('\x1Bc'); // clear screen
      output.write('Wähle eine docker-compose Datei mit ↑/↓ und Enter:\n\n');
      for (const [idx, file] of files.entries()) {
        if (idx === selected) {
          output.write(`> ${file} <\n`);
        } else {
          output.write(`  ${file}\n`);
        }
      }
    }

    return new Promise<void>((resolve) => {
      renderMenu();
      input.setRawMode(true);
      input.resume();
      input.setEncoding('utf8');

      function onKeypress(key: string) {
        if (key === '\u0003') {
          output.write('\nAbbruch.\n');
          process.exit();
        } else if (key === '\r' || key === '\n') {
          input.setRawMode(false);
          input.pause();
          output.write(`\nAusgewählt: ${files[selected]}\n`);
          input.removeListener('data', onKeypress);
          askEnvAndRun(String(files[selected]), defaultEnvFile);
          resolve();
        } else if (key === '\u001b[A') {
          selected = (selected - 1 + files.length) % files.length;
          renderMenu();
        } else if (key === '\u001b[B') {
          selected = (selected + 1) % files.length;
          renderMenu();
        }
      }
      input.on('data', onKeypress);
    });

    function askEnvAndRun(fileName: string, defaultEnvFile: string) {
      const envDir = path.resolve(process.cwd());
      const rl = readline.createInterface({ input, output });
      rl.question(
        `Name der .env Datei im Projektverzeichnis (Enter für Standard: ${defaultEnvFile}): `,
        (envFile) => {
          rl.close();
          try {
            const envName =
              envFile && typeof envFile === 'string' && envFile.trim()
                ? envFile.trim()
                : defaultEnvFile;
            const envPath = path.join(envDir, envName);
            DockerComposeUtil.run(fileName, ['up', '-d'], envPath);
            console.log('docker-compose erfolgreich ausgeführt!');
          } catch (err) {
            console.error('Fehler:', err);
            process.exit(1);
          }
        },
      );
    }
  }
}

if (process.platform === 'win32') {
  Section.promptAndRun();
}

export { Section };
