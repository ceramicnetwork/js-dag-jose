import signing, { GeneralJWS, DagJWS } from './signing'
import encryption, { GeneralJWE, DagJWE } from './encryption'
import stringify from 'fast-json-stable-stringify'

function stringToJose (jose: String): GeneralJWS | GeneralJWE {
  const split = jose.split('.')
  if (split.length === 3) {
    return signing.fromSplit(split)
  } else if (split.length === 5) {
    return jwe.fromSplit(split)
  } else {
    throw new Error('Not a valid JOSE string')
  }
}

// string name of the codec
const name = 'dag-jose'

// integer for the multiformat entry of the codec
const code = 133 // 0x85 https://github.com/multiformats/multicodec/blob/master/table.csv

function encode (obj: GeneralJWS | GeneralJWE | DagJWS | DagJWE | String): Buffer {
  // TODO - only encodes JWS nodes right now.
  let generalJose
  if (typeof obj === 'string') {
    generalJose = stringToJose(obj)
  } else if (obj.payload) { // it's a JWS
    generalJose = signing.encode(obj)
  } else if (obj.ciphertext) { // it's a JWE
    generalJose = jwe.encode(obj)
  } else {
    throw new Error('Not a valid JOSE object')
  }
  return Buffer.from(stringify(generalJose))
}

function decode (data: Buffer): DagJWS | DagJWE {
  // ipld gives us an Uint8Array instead of buffer
  if (data instanceof Uint8Array) data = Buffer.from(data)
  const parsed: GeneralJWS | GeneralJWE = JSON.parse(data)
  if (parsed.payload) { // it's a JWS
    return signing.decode(parsed)
  } else if (parsed.ciphertext) { // it's a JWE
    return jwe.decode(parsed)
  } else {
    throw new Error('Not a valid DAG-JOSE object')
  }
}

export default {
  name,
  code,
  encode,
  decode,
  signing,
  encryption,
  DagJWS,
  DagJWE
}
