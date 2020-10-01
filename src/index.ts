import signing, { DagJWS, EncodedJWS } from './signing'
export type { DagJWS } from './signing'
import encryption, { DagJWE, EncodedJWE } from './encryption'
export type { DagJWE } from './encryption'
import cbor from 'borc'

function stringToJose(jose: string): EncodedJWS | EncodedJWE {
  const split = jose.split('.')
  if (split.length === 3) {
    return signing.encode(signing.fromSplit(split))
  } else if (split.length === 5) {
    return encryption.encode(encryption.fromSplit(split))
  } else {
    throw new Error('Not a valid JOSE string')
  }
}

// string name of the codec
const name = 'dag-jose'

// integer for the multiformat entry of the codec
const code = 133 // 0x85 https://github.com/multiformats/multicodec/blob/master/table.csv

function isJWS(jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE): jose is DagJWS | EncodedJWS {
  return 'payload' in jose
}

function isJWE(jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE): jose is DagJWE | EncodedJWE {
  return 'ciphertext' in jose
}

function encode(obj: DagJWS | DagJWE | string): Uint8Array {
  let encodedJose
  if (typeof obj === 'string') {
    encodedJose = stringToJose(obj)
  } else if (isJWS(obj)) {
    encodedJose = signing.encode(obj)
  } else if (isJWE(obj)) {
    encodedJose = encryption.encode(obj)
  } else {
    throw new Error('Not a valid JOSE object')
  }
  return new Uint8Array(cbor.encode(encodedJose))
}

function decode(data: Uint8Array): DagJWS | DagJWE {
  let encoded: EncodedJWS | EncodedJWE
  try {
    encoded = cbor.decode(data)
  } catch (e) {
    throw new Error('Not a valid DAG-JOSE object')
  }
  if (isJWS(encoded)) {
    return signing.decode(encoded)
  } else if (isJWE(encoded)) {
    return encryption.decode(encoded)
  } else {
    throw new Error('Not a valid DAG-JOSE object')
  }
}

export default {
  name,
  code,
  encode,
  decode,
}
