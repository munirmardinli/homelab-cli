import { execFileSync } from 'node:child_process';
import readline from 'node:readline';

import type { PackageManagerOptions } from '../types/types.js';
import { BashHelper } from '../utils/bash.js';
import { TerminalAutomator } from '../utils/yamlTerminalAutomator.js';

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
    console.log('4. Kommandos aus YAML-Datei ausführen');
    console.log('5. Beenden');
    rl.question('Bitte wähle: ', (response: string): void => {
      if (response === '1') {
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
      } else if (response === '2') {
        try {
          const updateCmd = this.options.updateCmd;
          const opts = this.options as Partial<PackageManagerOptions> & {
            updateArgs?: () => string[];
          };
          const updateArgs =
            typeof opts.updateArgs === 'function' ? opts.updateArgs() : [];
          execFileSync(updateCmd, updateArgs, { stdio: 'inherit' });
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
      } else if (response === '3') {
        rl.question(
          'Welches Zielbetriebssystem? (1 = Linux/macOS, 2 = Windows, 3 = NAS): ',
          (osRequest) => {
            rl.close();
            let target = '';
            let port: string | undefined = undefined;
            let isWindowsTarget = false;
            if (osRequest === '1') {
              // Darwin (macOS/Linux)
              const user = process.env.DARWIN_USERNAME;
              const host = process.env.DARWIN_HOST;
              target = `${user}@${host}`;
              isWindowsTarget = false;
            } else if (osRequest === '2') {
              // Windows
              const user = process.env.WINDOWS_USERNAME;
              const host = process.env.WINDOWS_HOST;
              target = `${user}@${host}`;
              isWindowsTarget = true;
            } else if (osRequest === '3') {
              // NAS
              const user = process.env.NAS_USERNAME;
              const host = process.env.NAS_HOST;
              port = process.env.NAS_PORT || '22';
              target = `${user}@${host}`;
              isWindowsTarget = false;
            } else {
              console.log('Ungültige Eingabe!');
              this.menu();
              return;
            }
            BashHelper.startSSHSession(
              target,
              () => {
                this.menu();
              },
              isWindowsTarget,
              port,
            );
            process.on('SIGINT', () => process.exit(0));
          },
        );
      } else if (response === '4') {
        rl.question('Dateiname der YAML-Datei (ohne .yml): ', (fileName) => {
          TerminalAutomator.runAllCommandsFromYaml(fileName);
          rl.close();
          rl.on('close', () => {
            this.menu();
          });
        });
      } else if (response === '5') {
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
