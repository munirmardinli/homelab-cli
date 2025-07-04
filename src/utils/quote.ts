class StringQuoter {
  private static isStringObject(s: unknown): s is { op: string } {
    return Boolean(s) && typeof s === 'object' && s !== null && 'op' in s;
  }

  public static quote(xs: (string | { op: string })[]): string {
    return xs
      .map((s): string => {
        if (typeof s === 'string' && s === '') {
          // prettier-ignore
          return '\'\'';
        }

        if (StringQuoter.isStringObject(s)) {
          return s.op.replace(/(.)/g, '\\$1');
        }

        const str = String(s);
        // prettier-ignore
        if (/["]\s\\]/.test(str) && !str.includes('\'')) {
					return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
				}
        // prettier-ignore
        if (/["]'\s]/.test(str)) {
					// prettier-ignore
					return '"' + str.replace(/(["\\$`!])/g, '$1') + '"';
				}
        // prettier-ignore
        return str.replace(
					/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g,
					'$1\\$2',
				);
      })
      .join(' ');
  }
}

export { StringQuoter };
