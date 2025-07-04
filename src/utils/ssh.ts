import { spawn } from 'node:child_process';
+/**
+ * SSH utility class for running remote commands
+ * @class SshUtil
+ */
class SshUtil {
  static async runRemoteCommand({
    host,
    user,
    password,
    command,
    port,
  }: {
    host: string;
    user: string;
    password?: string;
    command?: string;
    port?: string;
  }) {
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
        args = ['-e', 'ssh', ...sshArgs];
      }

      const ssh = spawn(sshCmd, args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PASSWORD: password || '',
          SSHPASS: password || '',
        },
      });

      ssh.on('close', (code: number | null) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('SSH failed with code ' + code));
        }
      });
      ssh.on('error', reject);
    });
  }

  static async startInteractiveSession(
    host: string,
    user: string,
    password?: string,
    port?: string,
  ) {
    return new Promise<void>((resolve, reject) => {
      const sshArgs = [];
      if (port) {
        sshArgs.push('-p', port);
      }
      sshArgs.push('-o', 'StrictHostKeyChecking=no');
      sshArgs.push('-o', 'UserKnownHostsFile=/dev/null');
      sshArgs.push('-t');
      sshArgs.push(`${user}@${host}`);

      sshArgs.push('sudo -i');

      let sshCmd = 'ssh';
      let args = sshArgs;

      if (password) {
        if (process.platform === 'win32') {
          throw new Error(
            'sshpass wird unter Windows nicht unterstützt. Bitte SSH-Key-Authentifizierung verwenden.',
          );
        }
        sshCmd = 'sshpass';
        args = ['-e', 'ssh', ...sshArgs];
      }

      const ssh = spawn(sshCmd, args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          PASSWORD: password || '',
          SSHPASS: password || '',
        },
      });

      ssh.on('close', (code: number | null) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('SSH session failed with code ' + code));
        }
      });
      ssh.on('error', reject);
    });
  }
}

export { SshUtil };
