import signing, { DagJWS, EncodedJWS } from './signing'
export type { DagJWS } from './signing'
import encryption, { DagJWE, EncodedJWE } from './encryption'
export type { DagJWE } from './encryption'
import * as cbor from '@ipld/dag-cbor'
import type { ByteView } from 'multiformats/codecs/interface'

// string name of the codec
export const name = 'dag-jose'

// integer for the multiformat entry of the codec
export const code = 133 // 0x85 https://github.com/multiformats/multicodec/blob/master/table.csv

function isDagJWS(jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE): jose is DagJWS | EncodedJWS {
  return (
    'payload' in jose &&
    typeof jose.payload === 'string' &&
    'signatures' in jose &&
    Array.isArray(jose.signatures)
  )
}

function isEncodedJWS(
  jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE
): jose is DagJWS | EncodedJWS {
  return (
    'payload' in jose &&
    jose.payload instanceof Uint8Array &&
    'signatures' in jose &&
    Array.isArray(jose.signatures)
  )
}

function isEncodedJWE(
  jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE
): jose is DagJWE | EncodedJWE {
  return (
    'ciphertext' in jose &&
    jose.ciphertext instanceof Uint8Array &&
    'iv' in jose &&
    jose.iv instanceof Uint8Array &&
    'protected' in jose &&
    jose.protected instanceof Uint8Array &&
    'tag' in jose &&
    jose.tag instanceof Uint8Array
  )
}

function isDagJWE(jose: DagJWS | DagJWE | EncodedJWS | EncodedJWE): jose is DagJWE | EncodedJWE {
  return (
    'ciphertext' in jose &&
    typeof jose.ciphertext === 'string' &&
    'iv' in jose &&
    typeof jose.iv === 'string' &&
    'protected' in jose &&
    typeof jose.protected === 'string' &&
    'tag' in jose &&
    typeof jose.tag === 'string'
  )
}

/**
 * Create a properly formed DagJWS or DagJWE object, from either a DagJWS, or
 * DagJWE or the compact string form of either.
 * Applying this function on an already valid DagJWS or DagJWE object will be
 * idempotent. So this function can be used to either verify the proper object
 * form, or expand a compact string form and ensure you have the same form
 * of object that you would receive if you performed a round-trip encode/decode.
 */
export function toGeneral(jose: DagJWS | DagJWE | string): DagJWS | DagJWE {
  if (typeof jose === 'string') {
    const split = jose.split('.')
    if (split.length === 3) {
      return signing.fromSplit(split)
    } else if (split.length === 5) {
      return encryption.fromSplit(split)
    }
    throw new Error('Not a valid JOSE string')
  }
  if (isDagJWS(jose) || isDagJWE(jose)) {
    return jose
  }
  throw new Error('Not a valid unencoded JOSE object')
}

export function encode(obj: DagJWS | DagJWE | string): ByteView<EncodedJWS | EncodedJWE> {
  if (typeof obj === 'string') {
    obj = toGeneral(obj)
  }
  let encodedJose
  if (isDagJWS(obj)) {
    encodedJose = signing.encode(obj)
  } else if (isDagJWE(obj)) {
    encodedJose = encryption.encode(obj)
  } else {
    throw new Error('Not a valid JOSE object')
  }
  return new Uint8Array(cbor.encode(encodedJose))
}

export function decode(data: ByteView<EncodedJWS | EncodedJWE>): DagJWS | DagJWE {
  let encoded: EncodedJWS | EncodedJWE
  try {
    encoded = cbor.decode(data)
  } catch (e) {
    throw new Error('Not a valid DAG-JOSE object')
  }
  if (isEncodedJWS(encoded)) {
    return signing.decode(encoded)
  } else if (isEncodedJWE(encoded)) {
    return encryption.decode(encoded)
  } else {
    throw new Error('Not a valid DAG-JOSE object')
  }
}
