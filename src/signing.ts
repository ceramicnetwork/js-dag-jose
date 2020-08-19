import CID from 'cids'
import { Signer, createJWS, verifyJWS } from 'did-jwt'
import base64url from 'base64url'
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
  protected?: Buffer
  signature: Buffer
}

export interface EncodedJWS {
  payload: Buffer
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
    signature: base64url.toBuffer(signature.signature),
  }
  if (signature.header) encoded.header = signature.header
  if (signature.protected) encoded.protected = base64url.toBuffer(signature.protected)
  return encoded
}

function encode(jws: DagJWS): EncodedJWS {
  const encodedJws: EncodedJWS = {
    payload: base64url.toBuffer(jws.payload),
    signatures: jws.signatures.map(encodeSignature),
  }
  return encodedJws
}

function decodeSignature(encoded: EncodedSignature): JWSSignature {
  const sign: JWSSignature = {
    signature: base64url.encode(encoded.signature),
  }
  if (encoded.header) sign.header = encoded.header
  if (encoded.protected) sign.protected = base64url.encode(encoded.protected)
  return sign
}

function decode(encoded: EncodedJWS): DagJWS {
  const decoded: DagJWS = {
    payload: base64url.encode(encoded.payload),
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
  const payload = base64url.encode(cid.bytes as Buffer)
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
