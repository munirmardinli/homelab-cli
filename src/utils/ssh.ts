import { spawn } from 'node:child_process';
/**
 *
 *
 * @class SshUtil
 *
 * @static
 * @param {string} host
 * @param {string} user
 * @param {string} password
 * @param {string} [command]
 * @param {string} [port]
 * @return {*}
 * @memberof SshUtil
 */
class SshUtil {
  static async runRemoteCommand(
    host: string,
    user: string,
    password?: string,
    command?: string,
    port?: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      const sshArgs = [];
      if (port) {
        sshArgs.push('-p', port);
      }
      sshArgs.push('-o', 'StrictHostKeyChecking=no');
      sshArgs.push('-o', 'UserKnownHostsFile=/dev/null');
      sshArgs.push(`${user}@${host}`);
      if (command) {
        sshArgs.push(command);
      }

      let sshCmd = 'ssh';
      let args = sshArgs;

      if (password) {
        if (process.platform === 'win32') {
          throw new Error(
            'sshpass wird unter Windows nicht unterstützt. Bitte SSH-Key-Authentifizierung verwenden.',
          );
        }
        sshCmd = 'sshpass';
        args = ['-p', password, 'ssh', ...sshArgs];
      }

      const ssh = spawn(sshCmd, args, {
        stdio: 'inherit',
      });

      ssh.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('SSH failed with code ' + code));
        }
      });
      ssh.on('error', reject);
    });
  }
}

export { SshUtil };
