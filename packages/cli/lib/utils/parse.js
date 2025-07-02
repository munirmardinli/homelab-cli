export class ParseUtil {
    static matchAll(s, r) {
        const origIndex = r.lastIndex;
        const matches = [];
        let matchObj;
        while ((matchObj = r.exec(s))) {
            matches.push(matchObj);
            if (r.lastIndex === matchObj.index) {
                r.lastIndex += 1;
            }
        }
        r.lastIndex = origIndex;
        return matches;
    }
    static getVar(env, pre, key) {
        const r = typeof env === 'function' ? env(key) : env[key];
        if (typeof r === 'undefined' && key !== '') {
            return String(pre);
        }
        else if (typeof r === 'undefined') {
            return pre + '$';
        }
        if (typeof r === 'object') {
            return pre + ParseUtil.TOKEN + JSON.stringify(r) + ParseUtil.TOKEN;
        }
        return pre + String(r);
    }
    static parseInternal(string, env, opts = {}) {
        const BS = opts.escape || '\\';
        const BAREWORD = '(\\' +
            BS +
            '[\'"' +
            ParseUtil.META +
            ']|[^\\s\'"' +
            ParseUtil.META +
            '])+';
        const chunker = new RegExp([
            '(' + ParseUtil.CONTROL + ')',
            '(' +
                BAREWORD +
                '|' +
                ParseUtil.SINGLE_QUOTE +
                '|' +
                ParseUtil.DOUBLE_QUOTE +
                ')+',
        ].join('|'), 'g');
        const matches = ParseUtil.matchAll(string, chunker);
        if (matches.length === 0) {
            return [];
        }
        let commented = false;
        const mapped = matches
            .map((match) => {
            const s = match[0];
            if (!s || commented) {
                return undefined;
            }
            if (ParseUtil.controlRE.test(s)) {
                return { op: s };
            }
            let quote = false;
            let esc = false;
            let out = '';
            let isGlob = false;
            const parseEnvVar = (startIndex) => {
                let i = startIndex + 1;
                let varend;
                let varname;
                const char = s.charAt(i);
                if (char === '{') {
                    i += 1;
                    if (s.charAt(i) === '}') {
                        throw new Error('Bad substitution: ' + s.slice(i - 2, i + 1));
                    }
                    varend = s.indexOf('}', i);
                    if (varend < 0) {
                        throw new Error('Bad substitution: ' + s.slice(i));
                    }
                    varname = s.slice(i, varend);
                    i = varend;
                }
                else if (/[*@#?$!_-]/.test(char)) {
                    varname = char;
                    i += 1;
                }
                else {
                    const slicedFromI = s.slice(i);
                    const varendMatch = slicedFromI.match(/[^\w\d_]/);
                    if (!varendMatch) {
                        varname = slicedFromI;
                        i = s.length;
                    }
                    else if (typeof varendMatch.index !== 'undefined') {
                        varname = slicedFromI.slice(0, varendMatch.index);
                        i += varendMatch.index - 1;
                    }
                    else {
                        varname = slicedFromI;
                        i = s.length;
                    }
                }
                return { value: ParseUtil.getVar(env, '', varname), newIndex: i };
            };
            for (let i = 0; i < s.length; i++) {
                const c = s.charAt(i);
                isGlob = isGlob || (!quote && (c === '*' || c === '?'));
                if (esc) {
                    out += c;
                    esc = false;
                }
                else if (quote) {
                    if (c === quote) {
                        quote = false;
                    }
                    else if (quote === ParseUtil.SQ) {
                        out += c;
                    }
                    else {
                        if (c === BS) {
                            i += 1;
                            const nextChar = s.charAt(i);
                            if (nextChar === ParseUtil.DQ ||
                                nextChar === BS ||
                                nextChar === ParseUtil.DS) {
                                out += nextChar;
                            }
                            else {
                                out += BS + nextChar;
                            }
                        }
                        else if (c === ParseUtil.DS) {
                            const result = parseEnvVar(i);
                            out += result.value;
                            i = result.newIndex;
                        }
                        else {
                            out += c;
                        }
                    }
                }
                else if (c === ParseUtil.DQ || c === ParseUtil.SQ) {
                    quote = c;
                }
                else if (ParseUtil.controlRE.test(c)) {
                    return { op: s };
                }
                else if (ParseUtil.hash.test(c)) {
                    commented = true;
                    const commentObj = { comment: string.slice(match.index + i + 1) };
                    if (out.length) {
                        return [out, commentObj];
                    }
                    return [commentObj];
                }
                else if (c === BS) {
                    esc = true;
                }
                else if (c === ParseUtil.DS) {
                    const result = parseEnvVar(i);
                    out += result.value;
                    i = result.newIndex;
                }
                else {
                    out += c;
                }
            }
            if (isGlob) {
                return { op: 'glob', pattern: out };
            }
            return out;
        })
            .filter((x) => x !== undefined);
        const result = [];
        for (const arg of mapped) {
            if (Array.isArray(arg)) {
                result.push(...arg);
            }
            else {
                result.push(arg);
            }
        }
        return result;
    }
    static parse(s, env, opts = {}) {
        const mapped = ParseUtil.parseInternal(s, env, opts);
        if (typeof env !== 'function') {
            return mapped;
        }
        const result = [];
        for (const item of mapped) {
            if (typeof item === 'object') {
                result.push(item);
            }
            else {
                const xs = item.split(RegExp('(' + ParseUtil.TOKEN + '.*?' + ParseUtil.TOKEN + ')', 'g'));
                if (xs.length === 1) {
                    result.push(xs[0]);
                }
                else {
                    for (const x of xs.filter(Boolean)) {
                        if (ParseUtil.startsWithToken.test(x)) {
                            result.push(JSON.parse(x.split(ParseUtil.TOKEN)[1]));
                        }
                        else {
                            result.push(x);
                        }
                    }
                }
            }
        }
        return result;
    }
}
ParseUtil.CONTROL = '(?:' +
    [
        '\\|\\|',
        '\\&\\&',
        ';;',
        '\\|\\&',
        '\\<\\(',
        '\\<\\<\\<',
        '>>',
        '>\\&',
        '<\\&',
        '[&;()|<>]',
    ].join('|') +
    ')';
ParseUtil.controlRE = new RegExp('^' + ParseUtil.CONTROL + '$');
ParseUtil.META = '|&;()<> \t';
ParseUtil.SINGLE_QUOTE = '"((\\"|[^"])*?)"';
// prettier-ignore
ParseUtil.DOUBLE_QUOTE = '\'((\\\'|[^\'])*?)\'';
ParseUtil.hash = /^#$/;
// prettier-ignore
ParseUtil.SQ = '\'';
ParseUtil.DQ = '"';
ParseUtil.DS = '$';
ParseUtil.TOKEN = (() => {
    let token = '';
    const mult = 0x100000000;
    for (let i = 0; i < 4; i++) {
        token += (mult * Math.random()).toString(16);
    }
    return token;
})();
ParseUtil.startsWithToken = new RegExp('^' + ParseUtil.TOKEN);
