import { spawn } from "node:child_process";
import { platform } from "node:os";

export class BashHelper {
	private readonly INVALID_SSH_TARGET =
		"Ungültiges SSH-Ziel! Format: benutzer@host";
	private readonly SSH_EXIT_MSG = "SSH-Verbindung beendet (Exit-Code:";
	private readonly EXIT_MSG = "Das Programm wird beendet. Auf Wiedersehen!";
	private readonly DEFAULT_STADIO_MODE = "inherit";
	private readonly DEFAULT_OPEN_SSH_PATH =
		"C:/Windows/System32/OpenSSH/ssh.exe";
	private readonly DEFAULT_SSH_PATH = "/usr/bin/ssh";
	/**
	 * Startet eine interaktive SSH-Session zu einem Zielhost.
	 * @param host Zielhost (z.B. "user@host")
	 */
	startSSHSession(
		host: string,
		onExit?: () => void,
		isWindowsTarget?: boolean,
		port?: string,
	) {
		if (!host || !/^[\w.-]+@([\w.-]+)$/.test(host)) {
			console.error(this.INVALID_SSH_TARGET);
			return;
		}
		let sshArgs = [host];
		if (isWindowsTarget) {
			sshArgs = [host, "-t", "bash"];
		}
		if (port) {
			sshArgs = ["-p", port, ...sshArgs];
		}
		let sshPath = this.DEFAULT_SSH_PATH;
		if (platform() === "win32") {
			sshPath = this.DEFAULT_OPEN_SSH_PATH;
		}
		const ssh = spawn(sshPath, sshArgs, { stdio: this.DEFAULT_STADIO_MODE });
		ssh.on("exit", (code) => {
			console.log(`${this.SSH_EXIT_MSG} ${code})`);
			if (onExit) {
				onExit();
			}
		});
	}

	/**
	 * Beendet das CLI-Programm.
	 */
	exitCLI() {
		console.log(this.EXIT_MSG);
		process.exit(0);
	}
}
