/**
 * Hauptmodul für das CLI-Tool.
 *
 * Importiert plattformspezifische Funktionen und startet das Hauptprogramm.
 * Unterstützte Plattformen: macOS (brew), Windows (choco).
 *
 * @module index
 */
import { darwin } from './darwin.js';
import { windows } from './windows.js';

/**
 * Startet das Hauptprogramm und ruft die plattformspezifische Funktion auf.
 *
 * @function main
 * @returns {void}
 */
function main() {
  if (process.platform === 'darwin') {
    darwin();
  } else if (process.platform === 'win32') {
    windows();
  } else {
    console.log(
      'Dieses Skript unterstützt nur macOS (brew) und Windows (choco).',
    );
    process.exit(0);
  }
}

main();
