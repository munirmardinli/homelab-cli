import fetch from 'node-fetch';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { Readable } from 'stream';

export class FileUtil {
	static async downloadFile(url: string, dest: string) {
		const res = await fetch(url);
		if (!res.body) {
			throw new Error('Download response has no body');
		}
		const nodeStream = Readable.fromWeb(res.body as any);
		const fileStream = fs.createWriteStream(dest);
		await new Promise<void>((resolve, reject) => {
			nodeStream.pipe(fileStream);
			nodeStream.on('error', reject);
			fileStream.on('finish', () => resolve(undefined));
		});
	}

	static async unzipFile(zipPath: string, dest: string) {
		return new Promise<void>((resolve, reject) => {
			const unzip = spawn('unzip', [zipPath, '-d', dest]);
			unzip.on('close', (code) => {
				if (code === 0) {
					console.log('Entpackt!');
					resolve();
				} else {
					reject(new Error('Unzip failed with code ' + code));
				}
			});
			unzip.on('error', reject);
		});
	}
}

export class SshUtil {
	static async runRemoteCommand(host: string, user: string, password: string, command: string, port?: string) {
		return new Promise<void>((resolve, reject) => {
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
				} else {
					reject(new Error('SSH failed with code ' + code));
				}
			});
			ssh.on('error', reject);
		});
	}
}
