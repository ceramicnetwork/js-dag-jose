import { base64url } from 'multiformats/bases/base64'

export function toBase64url(b: Uint8Array): string {
  return base64url.encode(b).slice(1) // remove multibase prefix
}

export function fromBase64url(s: string): Uint8Array {
  return base64url.decode(`u${s}`)
}
