import yaml from 'js-yaml';
import fs from 'node:fs';

import { isStorageService } from '../utils/isStorage.js';

export class YamlDataService {
  private static readonly EVENTS_KEY = 'events';
  private static readonly LOADING_DATE_ERROR = '❌ Fehler beim Laden der Daten';
  private static readonly FILE_NOT_EXIST = '❌ Datei existiert nicht, erstelle';
  private static readonly FILE_EMPTY_CONTENT = '.yml mit leerem Inhalt.';
  private static readonly INVALID_EVENTS_PROP =
    'Die events-Eigenschaft in der Datei';
  private static readonly INVALID_EVENTS_PROP_SUFFIX =
    '.yml war ungültig. Erstelle leeres Array.';
  private static readonly UTF8_ENCODING = 'utf8';

  static getData<T>(fileName: string): T[] {
    try {
      const file = isStorageService.createYamlFileAndPath(fileName);
      isStorageService.createDirectoryExister(file);
      if (!fs.existsSync(file)) {
        console.error(
          `${this.FILE_NOT_EXIST} ${fileName}${this.FILE_EMPTY_CONTENT}`,
        );
        fs.writeFileSync(
          file,
          yaml.dump({ [this.EVENTS_KEY]: [] }),
          this.UTF8_ENCODING,
        );
      }

      const rawData = fs.readFileSync(file, this.UTF8_ENCODING);
      let data = yaml.load(rawData) as {
        events: T[];
      } | null;

      if (!data || !Array.isArray(data[this.EVENTS_KEY])) {
        console.warn(
          `${this.INVALID_EVENTS_PROP} ${fileName}${this.INVALID_EVENTS_PROP_SUFFIX}`,
        );
        data = { [this.EVENTS_KEY]: [] };
      }

      return data[this.EVENTS_KEY];
    } catch (e) {
      console.error(this.LOADING_DATE_ERROR, e);
    }
    return [];
  }
}
