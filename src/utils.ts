import { toString, fromString } from 'uint8arrays'

const B64U = 'base64url'

export function toBase64url(b: Uint8Array): string {
  return toString(b, B64U)
}

export function fromBase64url(s: string): Uint8Array {
  return fromString(s, B64U)
}
