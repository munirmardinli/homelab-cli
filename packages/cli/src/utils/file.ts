import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';

class FileUtil {
  static async downloadFile(url: string, dest: string) {
    const proto = url.startsWith('https') ? https : http;
    return new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const request = proto.get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(
            new Error(
              'Download fehlgeschlagen, Statuscode: ' + response.statusCode,
            ),
          );
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      });
      request.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
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
