import fs from "node:fs";

import { isStorageService } from "../utils/isStorage.js";

export class JsonDataService extends isStorageService {
	private readonly EVENTS_KEY = "events";
	private readonly LOADING_DATE_ERROR = "❌ Fehler beim Laden der Daten";
	private readonly FILE_NOT_EXIST = "❌ Datei existiert nicht, erstelle";
	private readonly FILE_EMPTY_CONTENT = ".json mit leerem Inhalt.";
	private readonly INVALID_EVENTS_PROP = "Die events-Eigenschaft in der Datei";
	private readonly INVALID_EVENTS_PROP_SUFFIX =
		".json war ungültig. Erstelle leeres Array.";
	private readonly UTF8_ENCODING = "utf8";

	getData<T>(fileName: string): T[] {
		try {
			const file = super.createJsonFileAndPath(fileName);
			super.createDirectoryExister(file);
			if (!fs.existsSync(file)) {
				console.error(
					`${this.FILE_NOT_EXIST} ${fileName}${this.FILE_EMPTY_CONTENT}`,
				);
				fs.writeFileSync(
					file,
					JSON.stringify({ [this.EVENTS_KEY]: [] }, null, 2),
					this.UTF8_ENCODING,
				);
			}

			const rawData = fs.readFileSync(file, this.UTF8_ENCODING);
			let data = JSON.parse(rawData) as {
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
