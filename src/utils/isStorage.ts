import fs from "node:fs";
import path from "node:path";

export class isStorageService {
	createDirectoryExister(filePath: string): boolean {
		const dirname = path.dirname(filePath);
		if (!fs.existsSync(dirname)) {
			fs.mkdirSync(dirname, { recursive: true });
			return true;
		}
		return false;
	}

	createJsonFileAndPath(fileName: string): string {
		return path.join(process.cwd(), "assets", `${fileName}.json`);
	}
}
