import CID from 'cids'
import { createJWS, verifyJWS, decodeJWT } from 'did-jwt'
import isCircular from 'is-circular'
import transform from 'lodash.transform'
import base64url from 'base64url'

// string name of the codec
const name = 'dag-jose'

// integer for the multiformat entry of the codec
const code = 133 // 0x85 https://github.com/multiformats/multicodec/blob/master/table.csv

interface PublicKey {
  publicKeyHex?: string;
  publicKeyBase64?: string;
}
type Signer = (data: string) => any // TODO - stricter types
type Encrypter = (data: string) => any // TODO - stricter types
type Decrypter = (data: string) => any // TODO - stricter types

interface JOSEOpts {
  header?: any;
  sign?: Signer;
  encrypt?: Encrypter;
}

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function encodePayload (obj: any): any {
  return transform(obj, (result, value, key) => {
    if (CID.isCID(value)) {
      result[key] = { '/': value.toString() }
    } else if (Buffer.isBuffer(value)) {
      result[key] = { '/': { base64: value.toString('base64') } }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = encodePayload(value)
    } else {
      result[key] = value
    }
  })
}

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function decodePayload (obj: any): any {
  return transform(obj, (result, value: any, key) => {
    if (typeof value === 'object' && value !== null) {
      if (value['/']) {
        if (typeof value['/'] === 'string') result[key] = new CID(value['/'])
        else if (typeof value['/'] === 'object' && value['/'].base64) {
          result[key] = Buffer.from(value['/'].base64, 'base64')
        } else result[key] = decodePayload(value)
      } else {
        result[key] = decodePayload(value)
      }
    } else {
      result[key] = value
    }
  })
}

interface JOSENode {
  _dagJOSEProtected: any;
  _dagJOSESignature?: Buffer;
  _dagJOSEEncryptedKey?: Buffer;
  _dagJOSEIV?: Buffer;
  _dagJOSECiphertext?: Buffer;
  _dagJOSEAuthenticationTag?: Buffer;
  [index: string]: any; // node payload
}

function decode (data: Buffer): JOSENode {
  // TODO - only decodes JWS nodes right now.
  const decoded = decodeJWT(data.toString())
  return {
    ...decodePayload(decoded.payload),
    _dagJOSEProtected: decoded.header,
    _dagJOSESignature: Buffer.from(decoded.signature)
  }
}

function encode (node: JOSENode): Buffer {
  // TODO - only encodes JWS nodes right now.
  const nodeCopy = Object.assign({}, node)
  const header = base64url.encode(JSON.stringify(nodeCopy._dagJOSEProtected))
  const signature = nodeCopy._dagJOSESignature.toString()
  delete nodeCopy._dagJOSEProtected
  delete nodeCopy._dagJOSESignature
  const payload = base64url.encode(JSON.stringify(encodePayload(nodeCopy)))
  return Buffer.from(`${header}.${payload}.${signature}`)
}

async function createJWSNode (payload: any, header: any, sign: Signer): Promise<JOSENode> {
  const jws = await createJWS(payload, sign, header)
  return decode(Buffer.from(jws))
}

async function createJWENode (payload: any, header: any, encrypt: Encrypter): Promise<JOSENode> {
  // TODO - Implement JWE creation with x25519 + xchacha20-poly1305
  return {}
}

async function createJOSENode (payload: any, opts: JOSEOpts): Promise<JOSENode> {
  if (isCircular(payload)) {
    throw new Error('Payload contains circular references.')
  }
  const serializedPayload = encodePayload(payload)
  if (opts.sign) {
    return createJWSNode(serializedPayload, opts.header, opts.sign)
  } else if (opts.encrypt) {
    return createJWENode(serializedPayload, opts.header, opts.encrypt)
  }
}

function verifyJOSENode (node: JOSENode, publicKeys: PublicKey[]): PublicKey {
  if (node._dagJOSESignature) {
    return verifyJWS(encode(node).toString(), publicKeys)
  } else {
    throw new Error('Can not verify encrypted node')
  }
}

async function decryptJOSENode (node: JOSENode, decrypt: Decrypter): Promise<any> {
  // TODO - Implement JWE decryption
  return {}
}


export {
  name,
  code,
  encode,
  decode,
  createJOSENode,
  verifyJOSENode,
  decryptJOSENode,
}
