import { fromBase64url, toBase64url } from './utils.js'
import { CID } from 'multiformats/cid'

export interface JWSSignature {
  header?: Record<string, any>
  protected?: string
  signature: string
}

export interface DagJWS {
  payload: string
  signatures: Array<JWSSignature>
  link?: CID
  pld?: Record<string, any>
}

export interface EncodedSignature {
  header?: Record<string, any>
  protected?: Uint8Array
  signature: Uint8Array
}

export interface EncodedJWS {
  payload: Uint8Array
  signatures: Array<EncodedSignature>
}

export interface PublicKey {
  id: string
  type: string
  controller: string
  publicKeyHex?: string
  publicKeyBase64?: string
}

export function fromSplit(split: Array<string>): DagJWS {
  const [protectedHeader, payload, signature] = split
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
    link: CID.decode(fromBase64url(payload)),
  }
}

function encodeSignature(signature: JWSSignature): EncodedSignature {
  const encoded: EncodedSignature = {
    signature: fromBase64url(signature.signature),
  }
  if (signature.header) encoded.header = signature.header
  if (signature.protected) encoded.protected = fromBase64url(signature.protected)
  return encoded
}

export function encode(jws: DagJWS): EncodedJWS {
  const payload = fromBase64url(jws.payload)
  return {
    payload,
    signatures: jws.signatures.map(encodeSignature),
  }
}

function decodeSignature(encoded: EncodedSignature): JWSSignature {
  const sign: JWSSignature = {
    signature: toBase64url(encoded.signature),
  }
  if (encoded.header) sign.header = encoded.header
  if (encoded.protected) sign.protected = toBase64url(encoded.protected)
  return sign
}

export function decode(encoded: EncodedJWS): DagJWS {
  const decoded: DagJWS = {
    payload: toBase64url(encoded.payload),
    signatures: encoded.signatures.map(decodeSignature),
  }
  try {
    decoded.pld = replaceCIDs(payloadToJSON(encoded.payload)) as Record<string, any>
    return decoded
  } catch (e) {
    try {
      decoded.link = CID.decode(new Uint8Array(encoded.payload))
      return decoded
    } catch (e) {
      throw new Error('Invalid payload, must be either JSON or CID')
    }
  }
}

function replaceCIDs(data: any): any {
  if (typeof data === 'string') {
    if (data.startsWith('ipfs://')) {
      return CID.parse(data.slice(7))
    }
  } else if (Array.isArray(data)) {
    return data.map(replaceCIDs) as any
  } else if (isObject(data)) {
    const newObj = {} as Record<string, any>
    for (const key in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newObj[key] = replaceCIDs(data[key])
    }
    return newObj
  }
  return data
}

function isObject(data: any): data is Record<string, any> {
  return typeof data === 'object' && data !== null
}

function payloadToJSON(data: Uint8Array): any {
  return JSON.parse(new TextDecoder().decode(data))
}
