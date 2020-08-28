import base64url from 'base64url'

interface JWERecipient {
  encrypted_key?: string // eslint-disable-line @typescript-eslint/camelcase
  header?: Record<string, any>
}

export interface DagJWE {
  aad?: string
  ciphertext: string
  iv?: string
  protected?: string
  recipients: Array<JWERecipient>
  tag?: string
  unprotected?: Record<string, any>
}

interface EncodedRecipient {
  encrypted_key?: Buffer // eslint-disable-line @typescript-eslint/camelcase
  header?: Record<string, any>
}

export interface EncodedJWE {
  aad?: Buffer
  ciphertext: Buffer
  iv?: Buffer
  protected?: Buffer
  recipients: Array<EncodedRecipient>
  tag?: Buffer
  unprotected?: Record<string, any>
}

type Encrypter = (data: string) => any // TODO - stricter types
type Decrypter = (data: string) => any // TODO - stricter types

function fromSplit(split: Array<string>): DagJWE {
  const [protectedHeader, encrypted_key, iv, ciphertext, tag] = split // eslint-disable-line @typescript-eslint/camelcase
  return {
    ciphertext,
    iv,
    protected: protectedHeader,
    recipients: [{ encrypted_key }], // eslint-disable-line @typescript-eslint/camelcase
    tag,
  }
}

function encodeRecipient(recipient: JWERecipient): EncodedRecipient {
  const encRec: EncodedRecipient = {}
  if (recipient.encrypted_key) encRec.encrypted_key = base64url.toBuffer(recipient.encrypted_key) // eslint-disable-line @typescript-eslint/camelcase
  if (recipient.header) encRec.header = recipient.header
  return encRec
}

function encode(jwe: DagJWE): EncodedJWE {
  const encJwe: EncodedJWE = {
    ciphertext: base64url.toBuffer(jwe.ciphertext),
    recipients: jwe.recipients.map(encodeRecipient),
  }
  if (jwe.aad) encJwe.aad = base64url.toBuffer(jwe.aad)
  if (jwe.iv) encJwe.iv = base64url.toBuffer(jwe.iv)
  if (jwe.protected) encJwe.protected = base64url.toBuffer(jwe.protected)
  if (jwe.tag) encJwe.tag = base64url.toBuffer(jwe.tag)
  if (jwe.unprotected) encJwe.unprotected = jwe.unprotected
  return encJwe
}

function decodeRecipient(encoded: EncodedRecipient): JWERecipient {
  const recipient: JWERecipient = {}
  if (encoded.encrypted_key) recipient.encrypted_key = base64url.encode(encoded.encrypted_key) // eslint-disable-line @typescript-eslint/camelcase
  if (encoded.header) recipient.header = encoded.header
  return recipient
}

function decode(encoded: EncodedJWE): DagJWE {
  const jwe: DagJWE = {
    ciphertext: base64url.encode(encoded.ciphertext),
    recipients: encoded.recipients.map(decodeRecipient),
  }
  if (encoded.aad) jwe.aad = base64url.encode(encoded.aad)
  if (encoded.iv) jwe.iv = base64url.encode(encoded.iv)
  if (encoded.protected) jwe.protected = base64url.encode(encoded.protected)
  if (encoded.tag) jwe.tag = base64url.encode(encoded.tag)
  if (encoded.unprotected) jwe.unprotected = encoded.unprotected
  return jwe
}

/*eslint-disable */
export async function createDagJWE(payload: any, header: any, encrypt: Encrypter): Promise<DagJWE> {
  throw new Error('Not implemented')
  // TODO - Implement JWE creation with x25519 + xchacha20-poly1305
}

export async function decryptDagJWE(node: DagJWE, decrypt: Decrypter): Promise<any> {
  throw new Error('Not implemented')
  // TODO - Implement JWE decryption
}
/*eslint-enable */

export default {
  fromSplit,
  decode,
  encode,
}
