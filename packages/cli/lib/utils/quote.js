class StringQuoter {
    static isStringObject(s) {
        return Boolean(s) && typeof s === 'object' && s !== null && 'op' in s;
    }
    static quote(xs) {
        return xs
            .map((s) => {
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
                return '\'' + str.replace(/(['])/g, '\\$1') + '\'';
            }
            // prettier-ignore
            if (/["]'\s]/.test(str)) {
                // prettier-ignore
                return '"' + str.replace(/(["\\$`!])/g, '$1') + '"';
            }
            // prettier-ignore
            return str.replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, '$1\\$2');
        })
            .join(' ');
    }
}
export { StringQuoter };
