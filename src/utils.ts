import * as u8a from 'uint8arrays'

const B64U = 'base64url'

export function toBase64url(b: Uint8Array): string {
  return u8a.toString(b, B64U)
}

export function fromBase64url(s: string): Uint8Array {
  return u8a.fromString(s, B64U)
}
