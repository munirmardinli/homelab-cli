import { execSync } from 'node:child_process';
import readline from 'node:readline';

function darwin() {
  if (process.platform !== 'darwin') {
    console.log('Dieses Skript funktioniert nur auf macOS!');
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\nWas möchtest du tun?');
  console.log('1. Paket installieren');
  console.log('2. Homebrew updaten');
  console.log('3. Beenden');
  rl.question('Bitte wähle (1/2/3): ', (antwort) => {
    if (antwort === '1') {
      rl.question('Welches Paket soll installiert werden? ', (paket) => {
        try {
          execSync(`brew list ${paket} || brew install ${paket}`, {
            stdio: 'inherit',
          });
          console.log(`${paket} wurde (ggf.) installiert.`);
        } catch (err) {
          console.error(`Fehler bei der Installation von ${paket}:`, err);
        }
        darwin();
      });
    } else if (antwort === '2') {
      try {
        execSync('brew update && brew upgrade', { stdio: 'inherit' });
        console.log('Homebrew und alle Pakete wurden aktualisiert.');
      } catch (err) {
        console.error('Fehler beim Updaten:', err);
      }
      darwin();
    } else if (antwort === '3') {
      console.log('Tschüss!');
      rl.close();
    } else {
      console.log('Ungültige Eingabe!');
      darwin();
    }
  });
}

export { darwin };
