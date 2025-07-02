import { Command } from 'commander';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import 'dotenv/config';

import { FileUtil } from './utils/file.js';
import { ParseUtil } from './utils/parse.js';
import { StringQuoter } from './utils/quote.js';
import { SshUtil } from './utils/ssh.js';

const program = new Command();

program
	.name('synology-cli')
	.description('Privates CLI für Setup-Skripte auf Synology, Windows, Mac')
	.version('1.0.0');

program
	.command('setup')
	.description('Führe ein Setup-Skript auf einem Zielsystem aus')
	.option('-h, --host <host>', 'SSH Host')
	.option('-u, --user <user>', 'SSH User')
	.option('-p, --password <password>', 'SSH Passwort')
	.option('-d, --download <url>', 'Datei herunterladen')
	.option('-z, --unzip <file>', 'Datei entpacken')
	.option('-c, --cmd <command>', 'Befehl ausführen')
	.option('-P, --port <port>', 'SSH Port')
	.action(async (opts) => {
		const host = opts.host || process.env.HOST;
		const user = opts.user || process.env.USER;
		const password = opts.password || process.env.PASSWORD;
		const port = opts.port || process.env.PORT || '22';
		if (!host || !user) {
			throw new Error('Host und User müssen entweder als Option oder in der .env angegeben werden!');
		}
		if (opts.download) {
			const res = await fetch(opts.download);
			if (!res.body) {
				throw new Error('Download response has no body');
			}
			const nodeStream = Readable.fromWeb(res.body as any);
			const fileStream = fs.createWriteStream('/tmp/downloaded.zip');
			await new Promise<void>((resolve, reject) => {
				nodeStream.pipe(fileStream);
				nodeStream.on('error', reject);
				fileStream.on('finish', () => resolve(undefined));
			});
		}
		if (opts.unzip) {
			await FileUtil.unzipFile('/tmp/downloaded.zip', '/tmp/unzipped');
		}
		if (opts.cmd) {
			const parsed = ParseUtil.parse(process.env.CMD || opts.cmd, process.env);
			const filtered = parsed.filter(
				(x): x is string | { op: string } =>
					typeof x === 'string' || (typeof x === 'object' && x !== null && 'op' in x && typeof (x as any).op === 'string')
			);
			const quoted = StringQuoter.quote(filtered);
			await SshUtil.runRemoteCommand(host, user, password, quoted, port);
		}
	});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
	program.outputHelp();
	process.exit(0);
}
