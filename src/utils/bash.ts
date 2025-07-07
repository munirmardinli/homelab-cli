import { spawn } from 'node:child_process';

class BashHelper {
  /**
   * Startet eine interaktive SSH-Session zu einem Zielhost.
   * @param host Zielhost (z.B. "user@host")
   */
  static startSSHSession(host: string, onExit?: () => void) {
    if (!host || !/^[\w.-]+@([\w.-]+)$/.test(host)) {
      console.error('Ungültiges SSH-Ziel! Format: benutzer@host');
      return;
    }
    const ssh = spawn('ssh', [host], { stdio: 'inherit' });
    ssh.on('exit', (code) => {
      console.log(`SSH-Verbindung beendet (Exit-Code: ${code})`);
      if (onExit) {
        onExit();
      }
    });
  }

  /**
   * Beendet das CLI-Programm.
   */
  static exitCLI() {
    console.log('Das Programm wird beendet. Auf Wiedersehen!');
    process.exit(0);
  }
}

export { BashHelper };
