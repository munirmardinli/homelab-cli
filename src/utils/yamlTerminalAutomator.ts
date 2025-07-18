import { execFileSync } from 'node:child_process';

import { YamlDataService } from '../config/localStorage.js';

class TerminalAutomator {
  private static readonly DEFAULT_STADIO_MODE = 'inherit';
  private static readonly NO_COMMANDS_FOUND =
    'Keine Kommandos in der YAML-Datei gefunden.';
  private static readonly EXEC_PREFIX = '\nFühre aus: ';
  private static readonly PARSE_WARN =
    'Befehl konnte nicht geparst werden und wird übersprungen:';
  private static readonly EXIT_CODE_MSG = 'Befehl';
  private static readonly EXIT_CODE_SUFFIX = 'wurde mit Exit-Code';
  private static readonly ERROR_PREFIX = 'Fehler beim Ausführen von';
  private static readonly ERROR_SUFFIX = ':';

  /**
   * Liest alle Kommandos aus einer YAML-Datei im assets/-Verzeichnis und führt sie nacheinander aus.
   * @param fileName Dateiname ohne .yml
   */
  static runAllCommandsFromYaml(fileName: string) {
    const commands = YamlDataService.getData<string>(fileName);
    if (!Array.isArray(commands) || commands.length === 0) {
      console.log(this.NO_COMMANDS_FOUND);
      return;
    }
    for (const cmd of commands) {
      console.log(`${this.EXEC_PREFIX} ${cmd}`);
      const [program, ...args] = TerminalAutomator.splitCommand(cmd);
      if (!program) {
        console.warn(`${this.PARSE_WARN} '${cmd}'`);
        continue;
      }
      try {
        execFileSync(program, args, {
          stdio: this.DEFAULT_STADIO_MODE,
          shell: false,
        });
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'status' in error) {
          const status = (error as { status?: number }).status;
          console.error(
            `${this.EXIT_CODE_MSG} '${cmd}' ${this.EXIT_CODE_SUFFIX} ${status} beendet.`,
          );
        } else {
          console.error(
            `${this.ERROR_PREFIX} '${cmd}'${this.ERROR_SUFFIX}`,
            error,
          );
        }
        break;
      }
    }
  }

  /**
   * Zerlegt einen Shell-Befehl in Programm und Argumente (ohne Regex, sicher).
   */
  private static splitCommand(cmd: string): string[] {
    return cmd.trim().split(/\s+/);
  }
}

export { TerminalAutomator };
