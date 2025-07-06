import { execSync } from 'node:child_process';
import readline from 'node:readline';

function windows() {
  if (process.platform !== 'win32') {
    console.log('Dieses Skript funktioniert nur auf Windows!');
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\nWas möchtest du tun?');
  console.log('1. Paket installieren');
  console.log('2. Chocolatey updaten');
  console.log('3. Beenden');
  rl.question('Bitte wähle (1/2/3): ', (antwort) => {
    if (antwort === '1') {
      rl.question('Welches Paket soll installiert werden? ', (paket) => {
        try {
          execSync(`choco install ${paket} -y`, {
            stdio: 'inherit',
          });
          console.log(`${paket} wurde (ggf.) installiert.`);
        } catch (err) {
          console.error(`Fehler bei der Installation von ${paket}:`, err);
        }
        windows();
      });
    } else if (antwort === '2') {
      try {
        execSync('choco upgrade all -y', { stdio: 'inherit' });
        console.log('Alle Chocolatey-Pakete wurden aktualisiert.');
      } catch (err) {
        console.error('Fehler beim Updaten:', err);
      }
      windows();
    } else if (antwort === '3') {
      console.log('Tschüss!');
      rl.close();
    } else {
      console.log('Ungültige Eingabe!');
      windows();
    }
  });
}

export { windows };
