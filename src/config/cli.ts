import { execFileSync } from 'node:child_process';
import readline from 'node:readline';

import type { PackageManagerOptions } from '../types/types.js';
import { BashHelper } from '../utils/bash.js';
import { TerminalAutomator } from '../utils/yamlTerminalAutomator.js';

class PackageManagerCLI {
  private readonly DEFAULT_STDIO_MODE = 'inherit';
  private readonly DEFAULT_SSH_PORT = '22';
  private readonly ACCESS_DENIED_KEYWORD = 'Zugriff';
  private readonly ACCESS_DENIED_KEYWORD_EN = 'access';
  private readonly WHAT_DO_YOU_WANT_TO_DO = '\nWas möchtest du tun?';
  private readonly SSH_CONNECTION_OPTION = '3. SSH-Verbindung aufbauen';
  private readonly EXECUTE_YAML_OPTION =
    '4. Kommandos aus YAML-Datei ausführen';
  private readonly EXIT_OPTION = '5. Beenden';
  private readonly PLEASE_CHOOSE_PROMPT = 'Bitte wähle: ';
  private readonly WHICH_PACKAGE_PROMPT =
    'Welches Paket soll installiert werden? ';
  private readonly INVALID_PACKAGE_NAME_ERROR = 'Ungültiger Paketname!';
  private readonly INSTALLATION_ERROR_PREFIX =
    'Fehler bei der Installation von ';
  private readonly ACCESS_DENIED_HINT =
    ': Zugriff verweigert! Bitte führe dieses Tool als Administrator aus!';
  private readonly INVALID_INPUT_ERROR = 'Ungültige Eingabe!';
  private readonly TARGET_OS_PROMPT =
    'Welches Zielbetriebssystem? (1 = Linux/macOS, 2 = Windows, 3 = NAS): ';
  private readonly PACKAGE_INSTALLED_MSG = 'wurde (ggf.) installiert.';
  private readonly GENERIC_UPDATE_ERROR = 'Fehler beim Updaten:';
  private readonly UPDATE_ACCESS_DENIED_ERROR =
    'Fehler beim Updaten: Zugriff verweigert! Bitte führe dieses Tool als Administrator aus!';

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
    console.log(this.WHAT_DO_YOU_WANT_TO_DO);
    console.log('1. ' + this.options.installLabel);
    console.log('2. ' + this.options.updateLabel);
    console.log(this.SSH_CONNECTION_OPTION);
    console.log(this.EXECUTE_YAML_OPTION);
    console.log(this.EXIT_OPTION);
    rl.question(this.PLEASE_CHOOSE_PROMPT, (response: string): void => {
      if (response === '1') {
        rl.question(this.WHICH_PACKAGE_PROMPT, (paket) => {
          if (!this.isValidPackageName(paket)) {
            console.error(this.INVALID_PACKAGE_NAME_ERROR);
            rl.close();
            return;
          }

          try {
            const cmd = this.options.installCmd;
            const args = this.options.installArgs(paket);
            execFileSync(cmd, args, { stdio: this.DEFAULT_STDIO_MODE });
            console.log(`${paket} ${this.PACKAGE_INSTALLED_MSG}`);
          } catch (err) {
            if (
              err instanceof Error &&
              (err.message.includes(this.ACCESS_DENIED_KEYWORD) ||
                err.message
                  .toLowerCase()
                  .includes(this.ACCESS_DENIED_KEYWORD_EN))
            ) {
              console.error(
                this.INSTALLATION_ERROR_PREFIX +
                  paket +
                  this.ACCESS_DENIED_HINT,
              );
            } else {
              console.error(`${this.INSTALLATION_ERROR_PREFIX} ${paket}:`, err);
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
          execFileSync(updateCmd, updateArgs, {
            stdio: this.DEFAULT_STDIO_MODE,
          });
          console.log(this.options.updateSuccessMsg);
        } catch (err) {
          if (
            err instanceof Error &&
            (err.message.includes(this.ACCESS_DENIED_KEYWORD) ||
              err.message.toLowerCase().includes(this.ACCESS_DENIED_KEYWORD_EN))
          ) {
            console.error(this.UPDATE_ACCESS_DENIED_ERROR);
          } else {
            console.error(this.GENERIC_UPDATE_ERROR, err);
          }
        }
        rl.close();
        rl.on('close', () => {
          this.menu();
        });
      } else if (response === '3') {
        rl.question(this.TARGET_OS_PROMPT, (osRequest) => {
          rl.close();
          let target = '';
          let port: string | undefined = undefined;
          let isWindowsTarget = false;
          if (osRequest === '1') {
            const user = process.env.DARWIN_USERNAME;
            const host = process.env.DARWIN_HOST;
            target = `${user}@${host}`;
            isWindowsTarget = false;
          } else if (osRequest === '2') {
            const user = process.env.WINDOWS_USERNAME;
            const host = process.env.WINDOWS_HOST;
            target = `${user}@${host}`;
            isWindowsTarget = true;
          } else if (osRequest === '3') {
            const user = process.env.NAS_USERNAME;
            const host = process.env.NAS_HOST;
            port = process.env.NAS_PORT || this.DEFAULT_SSH_PORT;
            target = `${user}@${host}`;
            isWindowsTarget = false;
          } else {
            console.log(this.INVALID_INPUT_ERROR);
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
        });
      } else if (response === '4') {
        let fileName = '';
        if (process.platform === 'win32') {
          fileName = 'windows';
        } else if (process.platform === 'darwin') {
          fileName = 'darwin';
        } else if (process.platform === 'linux') {
          fileName = 'linux';
        }
        TerminalAutomator.runAllCommandsFromYaml(fileName);
        rl.close();
        rl.on('close', () => {
          this.menu();
        });
      } else if (response === '5') {
        rl.close();
        BashHelper.exitCLI();
      } else {
        console.log(this.INVALID_INPUT_ERROR);
        rl.close();
        rl.on('close', () => {
          this.menu();
        });
      }
    });
  }
}

export { PackageManagerCLI };
