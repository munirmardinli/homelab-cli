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
      sshArgs.push(`${user}@${host}`);
      if (command) {
        sshArgs.push(command);
      }
      const ssh = spawn('ssh', sshArgs, {
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
