import { fromBase64url, toBase64url } from './utils'
import CID from 'cids'
import { Signer, createJWS, verifyJWS } from 'did-jwt'
import stringify from 'fast-json-stable-stringify'

interface JWSSignature {
  header?: Record<string, any>
  protected?: string
  signature: string
}

export interface DagJWS {
  payload: string
  signatures: Array<JWSSignature>
  link?: CID
}

interface EncodedSignature {
  header?: Record<string, any>
  protected?: Uint8Array
  signature: Uint8Array
}

export interface EncodedJWS {
  payload: Uint8Array
  signatures: Array<EncodedSignature>
}

interface PublicKey {
  id: string
  type: string
  controller: string
  publicKeyHex?: string
  publicKeyBase64?: string
}

function fromSplit(split: Array<string>): DagJWS {
  const [protectedHeader, payload, signature] = split
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
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

function encode(jws: DagJWS): EncodedJWS {
  const payload = fromBase64url(jws.payload)
  try {
    new CID(payload)
  } catch (e) {
    throw new Error('Not a valid DagJWS')
  }
  const encodedJws: EncodedJWS = {
    payload,
    signatures: jws.signatures.map(encodeSignature),
  }
  return encodedJws
}

function decodeSignature(encoded: EncodedSignature): JWSSignature {
  const sign: JWSSignature = {
    signature: toBase64url(encoded.signature),
  }
  if (encoded.header) sign.header = encoded.header
  if (encoded.protected) sign.protected = toBase64url(encoded.protected)
  return sign
}

function decode(encoded: EncodedJWS): DagJWS {
  const decoded: DagJWS = {
    payload: toBase64url(encoded.payload),
    signatures: encoded.signatures.map(decodeSignature),
  }
  decoded.link = new CID(new Uint8Array(encoded.payload))
  return decoded
}

export async function createDagJWS(
  cid: CID,
  signer: Signer,
  protectedHeader: Record<string, any>
): Promise<DagJWS> {
  // TODO - this function only supports single signature for now
  if (!CID.isCID(cid)) throw new Error('A CID has to be used as a payload')
  const payload = toBase64url(cid.bytes)
  if (protectedHeader) protectedHeader = JSON.parse(stringify(protectedHeader))
  const jws = await createJWS(payload, signer, protectedHeader)
  const dagJws = fromSplit(jws.split('.'))
  dagJws.link = cid
  return dagJws
}

export function verifyDagJWS(jws: DagJWS, publicKeys: Array<PublicKey>): Array<PublicKey> {
  // TODO - this function should probably use multikeys
  const pubkeys = []
  for (const signObj of jws.signatures) {
    const jwsString = `${signObj.protected}.${jws.payload}.${signObj.signature}`
    pubkeys.push(verifyJWS(jwsString, publicKeys))
  }
  return pubkeys
}

export default {
  fromSplit,
  encode,
  decode,
}
