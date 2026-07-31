import type { RequestHeader } from '../../models/request';
import { getBasicAuthHeader } from '../basic-auth/get-header';

/**
 * Encode a value with the `application/x-www-form-urlencoded` algorithm that
 * RFC 6749 Appendix B refers to: percent-encoding, with a space written as `+`.
 *
 * `encodeURIComponent` is almost this, but it writes a space as `%20` and
 * leaves `!'()*` untouched, so both are patched up afterwards.
 */
export const formUrlEncode = (value: string): string =>
  encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * Build the `Authorization: Basic` header for an OAuth 2.0 token request.
 *
 * RFC 6749 section 2.3.1 requires the client identifier and client password to
 * be form url-encoded *before* they are joined with `:` and base64-encoded.
 * Ordinary HTTP Basic auth has no such rule, which is why this wrapper exists
 * instead of the encoding being folded into `basic-auth/get-header`.
 */
export const getOAuth2BasicAuthHeader = (
  clientId?: string | null,
  clientSecret?: string | null,
): RequestHeader => getBasicAuthHeader(
  formUrlEncode(clientId || ''),
  formUrlEncode(clientSecret || ''),
);
