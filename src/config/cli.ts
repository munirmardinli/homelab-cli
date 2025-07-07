import { execSync, execFileSync } from 'node:child_process';
import readline from 'node:readline';

import type { PackageManagerOptions } from '../types/types.js';
import { BashHelper } from '../utils/bash.js';

class PackageManagerCLI {
  private options: PackageManagerOptions;

  constructor(options: PackageManagerOptions) {
    this.options = options;
  }

  private isValidPackageName(pkg: string): boolean {
    return /^[a-zA-Z0-9_\-\.]+$/.test(pkg);
  }

  public start() {
    if (process.platform !== this.options.platform) {
      console.log(this.options.onlyPlatformMsg);
      process.exit(0);
    }
    this.menu();
  }

  private menu() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log('\nWas möchtest du tun?');
    console.log('1. ' + this.options.installLabel);
    console.log('2. ' + this.options.updateLabel);
    console.log('3. SSH-Verbindung aufbauen');
    console.log('4. Beenden');
    rl.question('Bitte wähle (1/2/3/4): ', (antwort) => {
      if (antwort === '1') {
        rl.question('Welches Paket soll installiert werden? ', (paket) => {
          if (!this.isValidPackageName(paket)) {
            console.error('Ungültiger Paketname!');
            rl.close();
            return;
          }

          try {
            const cmd = this.options.installCmd;
            const args = this.options.installArgs(paket);
            execFileSync(cmd, args, { stdio: 'inherit' });
            console.log(`${paket} wurde (ggf.) installiert.`);
          } catch (err) {
            if (
              err instanceof Error &&
              (err.message.includes('Zugriff') ||
                err.message.toLowerCase().includes('access'))
            ) {
              console.error(
                'Fehler bei der Installation von ' +
                  paket +
                  ': Zugriff verweigert! Bitte führe dieses Tool als Administrator aus!',
              );
            } else {
              console.error(`Fehler bei der Installation von ${paket}:`, err);
            }
          }
          rl.close();
          rl.on('close', () => {
            this.menu();
          });
        });
      } else if (antwort === '2') {
        try {
          execSync(this.options.updateCmd, { stdio: 'inherit' });
          console.log(this.options.updateSuccessMsg);
        } catch (err) {
          if (
            err instanceof Error &&
            (err.message.includes('Zugriff') ||
              err.message.toLowerCase().includes('access'))
          ) {
            console.error(
              'Fehler beim Updaten: Zugriff verweigert! Bitte führe dieses Tool als Administrator aus!',
            );
          } else {
            console.error('Fehler beim Updaten:', err);
          }
        }
        rl.close();
        rl.on('close', () => {
          this.menu();
        });
      } else if (antwort === '3') {
        rl.question(
          'Bitte gib das SSH-Ziel ein (benutzer@host): ',
          (target) => {
            rl.question(
              'Welches Zielbetriebssystem? (1 = Linux/macOS, 2 = Windows): ',
              (osRequest) => {
                rl.close();
                const isWindowsTarget = osRequest === '2';
                BashHelper.startSSHSession(
                  target,
                  () => {
                    this.menu();
                  },
                  isWindowsTarget,
                );
                process.on('SIGINT', () => process.exit(0));
              },
            );
          },
        );
      } else if (antwort === '4') {
        rl.close();
        BashHelper.exitCLI();
      } else {
        console.log('Ungültige Eingabe!');
        rl.close();
        rl.on('close', () => {
          this.menu();
        });
      }
    });
  }
}

export { PackageManagerCLI };
