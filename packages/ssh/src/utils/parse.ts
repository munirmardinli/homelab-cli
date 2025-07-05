import crypto from 'node:crypto';

import { type Env, type ParsedToken } from '../types/types.js';

export class ParseUtil {
  private static readonly CONTROL =
    '(?:' +
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
  private static readonly controlRE = new RegExp('^' + ParseUtil.CONTROL + '$');
  private static readonly META = '|&;()<> \t';
  private static readonly SINGLE_QUOTE = '"((\\"|[^"])*?)"';
  // prettier-ignore
  private static readonly DOUBLE_QUOTE = '\'((\\\'|[^\'])*?)\'';
  private static readonly hash = /^#$/;
  // prettier-ignore
  private static readonly SQ = '\'';
  private static readonly DQ = '"';
  private static readonly DS = '$';
  private static readonly TOKEN = (() => {
    const tokenBuffer = crypto.randomBytes(16); // Generate 16 secure random bytes
    return tokenBuffer.toString('hex');
  })();
  private static readonly startsWithToken = new RegExp('^' + ParseUtil.TOKEN);

  private static matchAll(s: string, r: RegExp): RegExpExecArray[] {
    const origIndex = r.lastIndex;
    const matches: RegExpExecArray[] = [];
    let matchObj: RegExpExecArray | null;

    while ((matchObj = r.exec(s))) {
      matches.push(matchObj);
      if (r.lastIndex === matchObj.index) {
        r.lastIndex += 1;
      }
    }

    r.lastIndex = origIndex;
    return matches;
  }

  private static getVar(env: Env, pre: string, key: string): string {
    const r = typeof env === 'function' ? env(key) : env[key];

    if (typeof r === 'undefined' && key !== '') {
      return String(pre);
    } else if (typeof r === 'undefined') {
      return pre + '$';
    }

    if (typeof r === 'object') {
      return pre + ParseUtil.TOKEN + JSON.stringify(r) + ParseUtil.TOKEN;
    }
    return pre + String(r);
  }

  private static parseInternal(
    string: string,
    env: Env,
    opts: { escape?: string } = {},
  ): ParsedToken[] {
    const BS = opts.escape ?? '\\';
    const BAREWORD =
      '(\\' +
      BS +
      '[\'"' +
      ParseUtil.META +
      ']|[^\\s\'"' +
      ParseUtil.META +
      '])+';

    const chunker = new RegExp(
      [
        '(' + ParseUtil.CONTROL + ')',
        '(' +
          BAREWORD +
          '|' +
          ParseUtil.SINGLE_QUOTE +
          '|' +
          ParseUtil.DOUBLE_QUOTE +
          ')+',
      ].join('|'),
      'g',
    );

    const matches = ParseUtil.matchAll(string, chunker);

    if (matches.length === 0) {
      return [];
    }

    let commented = false;

    const mapped = matches
      .map((match): ParsedToken | ParsedToken[] | undefined => {
        const s = match[0];
        if (!s || commented) {
          return undefined;
        }
        if (ParseUtil.controlRE.test(s)) {
          return { op: s };
        }

        let quote: string | false = false;
        let esc = false;
        let out = '';
        let isGlob = false;

        const parseEnvVar = (
          startIndex: number,
        ): { value: string; newIndex: number } => {
          let i = startIndex + 1;
          let varend: number;
          let varname: string;
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
          } else if (/[*@#?$!_-]/.test(char)) {
            varname = char;
            i += 1;
          } else {
            const slicedFromI = s.slice(i);
            const varendMatch = slicedFromI.match(/[^\w\d_]/);
            if (!varendMatch) {
              varname = slicedFromI;
              i = s.length;
            } else if (typeof varendMatch.index !== 'undefined') {
              varname = slicedFromI.slice(0, varendMatch.index);
              i += varendMatch.index - 1;
            } else {
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
          } else if (quote) {
            if (c === quote) {
              quote = false;
            } else if (quote === ParseUtil.SQ) {
              out += c;
            } else {
              if (c === BS) {
                i += 1;
                const nextChar = s.charAt(i);
                out +=
                  nextChar === ParseUtil.DQ ||
                  nextChar === BS ||
                  nextChar === ParseUtil.DS
                    ? nextChar
                    : BS + nextChar;
              } else if (c === ParseUtil.DS) {
                const result = parseEnvVar(i);
                out += result.value;
                i = result.newIndex;
              } else {
                out += c;
              }
            }
          } else if (c === ParseUtil.DQ || c === ParseUtil.SQ) {
            quote = c;
          } else if (ParseUtil.controlRE.test(c)) {
            return { op: s };
          } else if (ParseUtil.hash.test(c)) {
            commented = true;
            const commentObj = { comment: string.slice(match.index + i + 1) };
            if (out.length) {
              return [out, commentObj];
            }
            return [commentObj];
          } else if (c === BS) {
            esc = true;
          } else if (c === ParseUtil.DS) {
            const result = parseEnvVar(i);
            out += result.value;
            i = result.newIndex;
          } else {
            out += c;
          }
        }

        if (isGlob) {
          return { op: 'glob', pattern: out };
        }

        return out;
      })
      .filter((x): x is ParsedToken | ParsedToken[] => x !== undefined);

    const result: ParsedToken[] = [];
    for (const arg of mapped) {
      if (Array.isArray(arg)) {
        result.push(...arg);
      } else {
        result.push(arg);
      }
    }
    return result;
  }

  public static parse(
    s: string,
    env: Env,
    opts: { escape?: string } = {},
  ): (string | object)[] {
    const mapped = ParseUtil.parseInternal(s, env, opts);
    if (typeof env !== 'function') {
      return mapped;
    }
    const result: (string | object)[] = [];
    for (const item of mapped) {
      if (typeof item === 'object') {
        result.push(item);
      } else {
        const xs = item.split(
          RegExp('(' + ParseUtil.TOKEN + '.*?' + ParseUtil.TOKEN + ')', 'g'),
        );
        if (xs.length === 1) {
          if (typeof xs[0] !== 'undefined') {
            result.push(xs[0]);
          }
        } else {
          for (const x of xs.filter(Boolean)) {
            if (ParseUtil.startsWithToken.test(x)) {
              const tokenSplit = x.split(ParseUtil.TOKEN)[1];
              if (typeof tokenSplit !== 'undefined') {
                result.push(JSON.parse(tokenSplit));
              }
            } else {
              result.push(x);
            }
          }
        }
      }
    }
    return result;
  }
}
