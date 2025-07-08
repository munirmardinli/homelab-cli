import { spawnSync } from 'node:child_process';

import { YamlDataService } from '../config/localStorage.js';

class TerminalAutomator {
  /**
   * Liest alle Kommandos aus einer YAML-Datei im assets/-Verzeichnis und führt sie nacheinander aus.
   * @param fileName Dateiname ohne .yml
   */
  static runAllCommandsFromYaml(fileName: string) {
    const commands = YamlDataService.getData<string>(fileName);
    if (!Array.isArray(commands) || commands.length === 0) {
      console.log('Keine Kommandos in der YAML-Datei gefunden.');
      return;
    }
    for (const cmd of commands) {
      console.log(`\nFühre aus: ${cmd}`);
      const [program, ...args] = TerminalAutomator.splitCommand(cmd);
      if (!program) {
        console.warn(
          `Befehl konnte nicht geparst werden und wird übersprungen: '${cmd}'`,
        );
        continue;
      }
      const result = spawnSync(program, args, {
        stdio: 'inherit',
        shell: true,
      });
      if (result.error) {
        console.error(`Fehler beim Ausführen von '${cmd}':`, result.error);
        break;
      }
      if (result.status !== 0) {
        console.error(
          `Befehl '${cmd}' wurde mit Exit-Code ${result.status} beendet.`,
        );
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
