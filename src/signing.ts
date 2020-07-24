import { encodeDagJson, decodeDagJson } from './utils'
import { Signer, createJWS, verifyJWS } from 'did-jwt'
import base64url from 'base64url'
import stringify from 'fast-json-stable-stringify'

interface GeneralSignature {
  header?: Record<string, any>
  protected?: string
  signature: string
}

interface GeneralJWS {
  payload: string
  signatures: Array<GeneralSignature>
}

interface DagSignature {
  header?: Record<string, any>
  protected?: Record<string, any>
  signature: Buffer
}

interface DagJWS {
  payload: Record<string, any> | Buffer
  signatures: Array<DagSignature>
}

interface PublicKey {
  id: string
  type: string
  owner: string
  publicKeyHex?: string
  publicKeyBase64?: string
}

function fromSplit(split: Array<string>): GeneralJWS {
  const [protectedHeader, payload, signature] = split
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
  }
}

function encodeSignature(ds: DagSignature): GeneralSignature {
  const sign: GeneralSignature = {
    signature: base64url.encode(ds.signature),
  }
  if (ds.header) sign.header = encodeDagJson(ds.header)
  if (ds.protected)
    sign.protected = base64url.encode(
      JSON.stringify(encodeDagJson(ds.protected)),
    )
  return sign
}

function isGeneralJWS(jws: DagJWS | GeneralJWS): jws is GeneralJWS {
  return typeof jws.payload === 'string'
}

function encode(jws: DagJWS | GeneralJWS): GeneralJWS {
  if (isGeneralJWS(jws)) {
    // General format already
    return Object.assign({}, jws)
  } else {
    const generalJws: GeneralJWS = {
      signatures: jws.signatures.map(encodeSignature),
      payload: null,
    }
    if (Buffer.isBuffer(jws.payload)) {
      generalJws.payload = base64url.encode(jws.payload)
    } else {
      generalJws.payload = base64url.encode(
        JSON.stringify(encodeDagJson(jws.payload)),
      )
    }
    return generalJws
  }
}

function decodeSignature(parsed: GeneralSignature): DagSignature {
  const sign: DagSignature = {
    signature: Buffer.from(parsed.signature, 'base64'),
  }
  if (parsed.header) sign.header = decodeDagJson(parsed.header)
  if (parsed.protected)
    sign.protected = decodeDagJson(
      JSON.parse(Buffer.from(parsed.protected, 'base64').toString()),
    )
  return sign
}

function decode(parsed: GeneralJWS): DagJWS {
  const decoded: DagJWS = {
    payload: Buffer.from(parsed.payload, 'base64'),
    signatures: parsed.signatures.map(decodeSignature),
  }
  try {
    decoded.payload = decodeDagJson(JSON.parse(decoded.payload.toString()))
  } catch (e) {
    // return payload as buffer if it isn't json
  }
  return decoded
}

async function create(
  payload: Record<string, any>,
  signer: Signer,
  protectedHeader: Record<string, any>,
): Promise<DagJWS> {
  // TODO - this function only supports single signature for now
  // non ideal way to sort for now
  payload = JSON.parse(stringify(encodeDagJson(payload)))
  if (protectedHeader)
    protectedHeader = JSON.parse(stringify(encodeDagJson(protectedHeader)))
  const jws = await createJWS(payload, signer, protectedHeader)
  const generalJws = fromSplit(jws.split('.'))
  return decode(generalJws)
}

function verify(jws: DagJWS, publicKeys: PublicKey[]): PublicKey[] {
  // TODO - this function should use multikeys
  const generalJws = encode(jws)
  const pubkeys = []
  for (const signObj of generalJws.signatures) {
    const jwsString = `${signObj.protected}.${generalJws.payload}.${signObj.signature}`
    pubkeys.push(verifyJWS(jwsString, publicKeys))
  }
  return pubkeys
}

export default {
  fromSplit,
  encode,
  decode,
  create,
  verify,
}
export { GeneralJWS, DagJWS }
