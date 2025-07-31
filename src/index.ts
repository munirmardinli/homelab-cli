/**
 * Hauptmodul für das CLI-Tool.
 *
 * Importiert plattformspezifische Funktionen und startet das Hauptprogramm.
 * Unterstützte Plattformen: macOS (brew), Windows (choco).
 *
 * Menü-Option 5: Kommandos aus YAML-Datei ausführen
 *
 * @module index
 */
import { PackageManagerCLI } from './config/cli.js';
import 'dotenv/config';
/**
 * Startet das Hauptprogramm und ruft die plattformspezifische Funktion auf.
 *
 * @function main
 * @returns {void}
 */
function main(): void {
  if (process.platform === 'darwin') {
    const cli = new PackageManagerCLI({
      platform: 'darwin',
      installCmd: 'brew',
      installArgs: (pkg) => ['install', pkg],
      updateCmd: 'brew update && brew upgrade',
      installLabel: 'Paket installieren',
      updateLabel: 'Homebrew updaten',
      exitLabel: 'Beenden',
      onlyPlatformMsg: 'Dieses Skript funktioniert nur auf macOS!',
      updateSuccessMsg: 'Homebrew und alle Pakete wurden aktualisiert.',
      exitMsg: 'Tschüss!',
    });
    cli.start();
  } else if (process.platform === 'win32') {
    const cli = new PackageManagerCLI({
      platform: 'win32',
      installCmd: 'choco',
      installArgs: (pkg) => ['install', pkg, '-y'],
      updateCmd: 'choco upgrade all -y',
      installLabel: 'Paket installieren',
      updateLabel: 'Chocolatey updaten',
      exitLabel: 'Beenden',
      onlyPlatformMsg: 'Dieses Skript funktioniert nur auf Windows!',
      updateSuccessMsg: 'Alle Chocolatey-Pakete wurden aktualisiert.',
      exitMsg: 'Tschüss!',
    });
    cli.start();
  } else if (process.platform === 'linux') {
    const cli = new PackageManagerCLI({
      platform: 'linux',
      installCmd: 'apk',
      installArgs: (pkg) => ['add', pkg],
      updateCmd: 'apk update && apk upgrade',
      installLabel: 'Paket installieren',
      updateLabel: 'Pakete updaten',
      exitLabel: 'Beenden',
      onlyPlatformMsg: 'Dieses Skript funktioniert nur auf Linux!',
      updateSuccessMsg: 'Alle Pakete wurden aktualisiert.',
      exitMsg: 'Tschüss!',
    });
    cli.start();
  } else {
    console.log(
      'Dieses Skript unterstützt nur macOS (brew), Windows (choco) und Linux (apk).',
    );
    process.exit(0);
  }
}

main();
