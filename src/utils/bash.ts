import { spawn } from 'node:child_process';
import { platform } from 'node:os';

class BashHelper {
  /**
   * Startet eine interaktive SSH-Session zu einem Zielhost.
   * @param host Zielhost (z.B. "user@host")
   */
  static startSSHSession(
    host: string,
    onExit?: () => void,
    isWindowsTarget?: boolean,
  ) {
    if (!host || !/^[\w.-]+@([\w.-]+)$/.test(host)) {
      console.error('Ungültiges SSH-Ziel! Format: benutzer@host');
      return;
    }
    let sshArgs = [host];
    if (isWindowsTarget) {
      sshArgs = [host, '-t', 'bash'];
    }
    let sshPath = '/usr/bin/ssh';
    if (platform() === 'win32') {
      sshPath = 'C:/Windows/System32/OpenSSH/ssh.exe';
    }
    const ssh = spawn(sshPath, sshArgs, { stdio: 'inherit' });
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
