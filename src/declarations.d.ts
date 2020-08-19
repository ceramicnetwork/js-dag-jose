declare module 'borc' {
  export function encode(obj: any): Buffer
  export function decode(buf: Buffer): any
}
