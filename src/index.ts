import inquirer from 'inquirer';
import { execSync } from 'node:child_process';

async function main() {
  if (process.platform !== 'darwin') {
    console.log('Dieses Skript funktioniert nur auf macOS!');
    return;
  }

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Was möchtest du tun?',
        choices: [
          { name: 'Paket installieren', value: 'install' },
          { name: 'Homebrew updaten', value: 'update' },
          { name: 'Beenden', value: 'exit' },
        ],
      },
    ]);

    if (action === 'install') {
      const { paket } = await inquirer.prompt([
        {
          type: 'input',
          name: 'paket',
          message: 'Welches Paket soll installiert werden?',
        },
      ]);
      try {
        execSync(`brew list ${paket} || brew install ${paket}`, {
          stdio: 'inherit',
        });
        console.log(`${paket} wurde (ggf.) installiert.`);
      } catch (err) {
        console.error(`Fehler bei der Installation von ${paket}:`, err);
      }
    } else if (action === 'update') {
      try {
        execSync('brew update && brew upgrade', { stdio: 'inherit' });
        console.log('Homebrew und alle Pakete wurden aktualisiert.');
      } catch (err) {
        console.error('Fehler beim Updaten:', err);
      }
    } else if (action === 'exit') {
      console.log('Tschüss!');
      break;
    }
  }
}

main();
