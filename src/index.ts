import signing, { GeneralJWS, DagJWS } from './signing'
export type { DagJWS, GeneralJWS } from './signing'
import encryption, { GeneralJWE, DagJWE } from './encryption'
export type { DagJWE, GeneralJWE } from './encryption'
import stringify from 'fast-json-stable-stringify'

function stringToJose (jose: string): GeneralJWS | GeneralJWE {
  const split = jose.split('.')
  if (split.length === 3) {
    return signing.fromSplit(split)
  } else if (split.length === 5) {
    return encryption.fromSplit(split)
  } else {
    throw new Error('Not a valid JOSE string')
  }
}

// string name of the codec
const name = 'dag-jose'

// integer for the multiformat entry of the codec
const code = 133 // 0x85 https://github.com/multiformats/multicodec/blob/master/table.csv

function isJWS(jose: GeneralJWS | GeneralJWE | DagJWS | DagJWE): jose is GeneralJWS | DagJWS {
  return 'payload' in jose
}

function isJWE(jose: GeneralJWS | GeneralJWE | DagJWS | DagJWE): jose is GeneralJWE | DagJWE {
  return 'ciphertext' in jose
}

function encode (obj: GeneralJWS | GeneralJWE | DagJWS | DagJWE | string): Buffer {
  let generalJose
  if (typeof obj === 'string') {
    generalJose = stringToJose(obj)
  } else if (isJWS(obj)) {
    generalJose = signing.encode(obj)
  } else if (isJWE(obj)) {
    generalJose = encryption.encode(obj)
  } else {
    throw new Error('Not a valid JOSE object')
  }
  return Buffer.from(stringify(generalJose))
}

function decode (data: Buffer): DagJWS | DagJWE {
  // ipld gives us an Uint8Array instead of buffer
  if (data instanceof Uint8Array) data = Buffer.from(data)
  const parsed: GeneralJWS | GeneralJWE = JSON.parse(data.toString())
  if (isJWS(parsed)) {
    return signing.decode(parsed)
  } else if (isJWE(parsed)) {
    return encryption.decode(parsed)
  } else {
    throw new Error('Not a valid DAG-JOSE object')
  }
}

export default {
  name,
  code,
  encode,
  decode
}
export {
  signing,
  encryption
}
