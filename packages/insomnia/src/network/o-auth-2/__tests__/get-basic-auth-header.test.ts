import { describe, expect, it } from '@jest/globals';

import { formUrlEncode, getOAuth2BasicAuthHeader } from '../get-basic-auth-header';

const decode = (header: { value: string }) =>
  Buffer.from(header.value.replace('Basic ', ''), 'base64').toString('utf8');

describe('formUrlEncode', () => {
  it('leaves unreserved characters alone', () => {
    expect(formUrlEncode('client-id_1.2~3')).toBe('client-id_1.2~3');
  });

  it('writes a space as +, not %20', () => {
    expect(formUrlEncode('two words')).toBe('two+words');
  });

  it('percent-encodes reserved characters', () => {
    expect(formUrlEncode('a:b/c?d=e&f#g')).toBe('a%3Ab%2Fc%3Fd%3De%26f%23g');
  });

  it('percent-encodes the characters encodeURIComponent skips', () => {
    expect(formUrlEncode("!'()*")).toBe('%21%27%28%29%2A');
  });

  it('handles an empty string', () => {
    expect(formUrlEncode('')).toBe('');
  });
});

describe('getOAuth2BasicAuthHeader', () => {
  it('encodes the credentials before base64, per RFC 6749 section 2.3.1', () => {
    // A secret of `p@ss word/+` must reach the server as `p%40ss+word%2F%2B`.
    const header = getOAuth2BasicAuthHeader('my client', 'p@ss word/+');

    expect(header.name).toBe('Authorization');
    expect(decode(header)).toBe('my+client:p%40ss+word%2F%2B');
  });

  it('passes through credentials that need no encoding', () => {
    expect(decode(getOAuth2BasicAuthHeader('id', 'secret'))).toBe('id:secret');
  });

  it('treats missing credentials as empty strings', () => {
    expect(decode(getOAuth2BasicAuthHeader(undefined, null))).toBe(':');
  });
});
