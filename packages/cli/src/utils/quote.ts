class StringQuoter {
	private static isStringObject(s: unknown): s is { op: string } {
		return !!s && typeof s === 'object' && 'op' in s;
	}

	public static quote(xs: (string | { op: string })[]): string {
		return xs.map((s): string => {
			if (typeof s === 'string' && s === '') {
				return '\'\'';
			}

			if (StringQuoter.isStringObject(s)) {
				return s.op.replace(/(.)/g, '\\$1');
			}

			const str = String(s);

			if ((/["\s\\]/).test(str) && !(/'/).test(str)) {
				return "'" + str.replace(/(['])/g, '\\$1') + "'";
			}

			if ((/["'\s]/).test(str)) {
				return '"' + str.replace(/(["\\$`!])/g, '\\$1') + '"';
			}

			return str.replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, '$1\\$2');
		}).join(' ');
	}
}

export { StringQuoter };
