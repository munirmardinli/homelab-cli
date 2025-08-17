import { PackageManagerCLI } from './config/cli.js';
import 'dotenv/config';

/**
 * Eine Klasse, die das Hauptprogramm kapselt und die plattformspezifische Funktion aufruft.
 */
class PackageManagerApp {
  /**
   * Startet die Anwendung basierend auf der aktuellen Plattform.
   * @returns {void}
   */
  public run(): void {
    if (process.platform === 'darwin') {
      this.runMacOS();
    } else if (process.platform === 'win32') {
      this.runWindows();
    } else if (process.platform === 'linux') {
      this.runLinux();
    } else {
      this.showUnsupportedPlatformMessage();
    }
  }

  /**
   * Führt die macOS-spezifische Logik aus.
   * @private
   * @returns {void}
   */
  private runMacOS(): void {
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
  }

  /**
   * Führt die Windows-spezifische Logik aus.
   * @private
   * @returns {void}
   */
  private runWindows(): void {
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
  }

  /**
   * Führt die Linux-spezifische Logik aus.
   * @private
   * @returns {void}
   */
  private runLinux(): void {
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
  }

  /**
   * Zeigt eine Nachricht für nicht unterstützte Plattformen an.
   * @private
   * @returns {void}
   */
  private showUnsupportedPlatformMessage(): void {
    console.log(
      'Dieses Skript unterstützt nur macOS (brew), Windows (choco) und Linux (apk).',
    );
    process.exit(0);
  }
}

new PackageManagerApp().run();
