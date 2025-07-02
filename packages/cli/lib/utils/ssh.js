import { spawn } from 'node:child_process';
class SshUtil {
    static async runRemoteCommand(host, user, password, command, port) {
        return new Promise((resolve, reject) => {
            const sshArgs = [];
            if (port) {
                sshArgs.push('-p', port);
            }
            sshArgs.push(`${user}@${host}`, command);
            const ssh = spawn('ssh', sshArgs, {
                stdio: 'inherit'
            });
            ssh.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error('SSH failed with code ' + code));
                }
            });
            ssh.on('error', reject);
        });
    }
}
export { SshUtil };
