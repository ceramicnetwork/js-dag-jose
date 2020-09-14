declare module 'borc' {
  export function encode(obj: any): Buffer
  export function decode(buf: Uint8Array): any
}

declare module 'uint8arrays' {
  export function toString(b: Uint8Array, enc?: string): string
  export function fromString(s: string, enc?: string): Uint8Array
}
