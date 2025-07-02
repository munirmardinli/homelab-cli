import fetch from 'node-fetch';
import { spawn } from 'node:child_process';
import * as fs from 'node:fs';

class FileUtil {
  static async downloadFile(url: string, dest: string) {
    const res = await fetch(url);
    if (!res.body) {
      throw new Error('Download response has no body');
    }
    const fileStream = fs.createWriteStream(dest);
    await new Promise<void>((resolve, reject) => {
      res.body?.pipe(fileStream);
      res.body?.on('error', reject);
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

export { FileUtil };
