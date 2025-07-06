import crypto from 'node:crypto';
import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';

import { Command } from 'commander';

import { type Env } from './types/index.js';
import { FileUtil } from './utils/file.js';
import { ParseUtil } from './utils/parse.js';
import { StringQuoter } from './utils/quote.js';
import { SshUtil } from './utils/ssh.js';

class Cli {
  private getSecureTempDir(): string {
    const baseTempDir = os.tmpdir();
    const randomString = crypto.randomBytes(8).toString('hex');
    const secureTempDir = path.join(
      baseTempDir,
      `synology-cli-${randomString}`,
    );
    fs.mkdirSync(secureTempDir, { mode: 0o700 });
    return secureTempDir;
  }

  private cleanupTempDir(tempDir: string): void {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error(`Failed to cleanup temp directory: ${error}`);
    }
  }

  public run(): void {
    const program = new Command();

    program
      .name('synology-cli')
      .description('Privates CLI für Setup-Skripte auf Synology, Windows, Mac')
      .version('1.0.0');

    program
      .command('session')
      .description(
        'Starte eine interaktive SSH-Session mit automatischem Root-Login',
      )
      .option('-h, --host <host>', 'SSH Host')
      .option('-u, --user <user>', 'SSH User')
      .option('-p, --password <password>', 'SSH Passwort')
      .option('-P, --port <port>', 'SSH Port')
      .action(async (opts) => {
        const host = opts.host ?? process.env.HOST;
        const user = opts.user ?? process.env.USER;
        const password = opts.password ?? process.env.PASSWORD;
        const port = opts.port ?? process.env.PORT ?? '22';

        if (!host || !user) {
          throw new Error(
            'Host und User müssen entweder als Option oder in der .env angegeben werden!',
          );
        }

        console.log(`Verbinde mit ${user}@${host}:${port}...`);
        console.log('Automatischer Root-Login wird ausgeführt...');
        console.log('Drücke Ctrl+C zum Beenden der Session.');

        await SshUtil.startInteractiveSession(host, user, password, port);
      });

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
      .option('-s, --sudo', 'Führe das Kommando mit sudo aus', true)
      .action(async (opts) => {
        const host = opts.host ?? process.env.HOST;
        const user = opts.user ?? process.env.USER;
        const password = opts.password ?? process.env.PASSWORD;
        const port = opts.port ?? process.env.PORT ?? '22';

        if (!host || !user) {
          throw new Error(
            'Host und User müssen entweder als Option oder in der .env angegeben werden!',
          );
        }

        const tempDir = this.getSecureTempDir();
        try {
          if (opts.download) {
            const downloadPath = path.join(tempDir, 'downloaded.zip');
            await new Promise<void>((resolve, reject) => {
              https
                .get(opts.download, (res) => {
                  if (res.statusCode !== 200) {
                    reject(
                      new Error(
                        `Download fehlgeschlagen: Status ${res.statusCode}`,
                      ),
                    );
                    return;
                  }
                  const fileStream = fs.createWriteStream(downloadPath, {
                    mode: 0o600,
                  });
                  res.pipe(fileStream);
                  res.on('error', reject);
                  fileStream.on('finish', () => resolve(undefined));
                  fileStream.on('error', reject);
                })
                .on('error', reject);
            });

            if (opts.unzip) {
              const unzipDir = path.join(tempDir, 'unzipped');
              fs.mkdirSync(unzipDir, { mode: 0o700 });
              await FileUtil.unzipFile(downloadPath, unzipDir);
            }
          }

          if (opts.cmd) {
            const parsed = ParseUtil.parse(opts.cmd, process.env as Env);
            const filtered = parsed.filter(
              (x): x is string | { op: string } =>
                typeof x === 'string' ||
                (typeof x === 'object' &&
                  x !== null &&
                  'op' in x &&
                  typeof (x as { op: unknown }).op === 'string'),
            );
            const quoted = StringQuoter.quote(filtered);
            let remoteCmd = quoted;
            if (opts.sudo !== false) {
              remoteCmd = `sudo -i -- ${quoted}`;
            }
            await SshUtil.runRemoteCommand({
              host,
              user,
              password,
              command: remoteCmd,
              port,
            });
          } else {
            await SshUtil.runRemoteCommand({ host, user, password, port });
          }
        } finally {
          this.cleanupTempDir(tempDir);
        }
      });

    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  }
}

export { Cli };
