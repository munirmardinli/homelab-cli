import yaml from 'js-yaml';
import fs from 'node:fs';

import { isStorageService } from '../utils/isStorage.js';

export class YamlDataService {
  private static readonly EVENTS_KEY = 'events' as const;

  static getData<T>(fileName: string): T[] {
    try {
      const file = isStorageService.createYamlFileAndPath(fileName);
      isStorageService.createDirectoryExister(file);
      if (!fs.existsSync(file)) {
        new Error(
          `❌ Datei existiert nicht, erstelle ${fileName}.yml mit leerem Inhalt.`,
        );
        fs.writeFileSync(
          file,
          yaml.dump({ [YamlDataService.EVENTS_KEY]: [] }),
          'utf8',
        );
      }

      const rawData = fs.readFileSync(file, 'utf8');
      let data = yaml.load(rawData) as {
        [YamlDataService.EVENTS_KEY]: T[];
      } | null;

      if (!data || !Array.isArray(data[YamlDataService.EVENTS_KEY])) {
        console.warn(
          `Die 'events'-Eigenschaft in der Datei ${fileName}.yml war ungültig. Erstelle leeres Array.`,
        );
        data = { [YamlDataService.EVENTS_KEY]: [] };
      }

      return data[YamlDataService.EVENTS_KEY];
    } catch (e) {
      console.error('❌ Fehler beim Laden der Daten', e);
    }
    // Fallback: leeres Array zurückgeben, falls ein Fehler auftritt
    return [];
  }
}

export { YamlDataService as yamlDataService };
