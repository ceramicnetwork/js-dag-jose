import { fromBase64url, toBase64url } from './utils'

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
  encrypted_key?: Uint8Array // eslint-disable-line @typescript-eslint/camelcase
  header?: Record<string, any>
}

export interface EncodedJWE {
  aad?: Uint8Array
  ciphertext: Uint8Array
  iv?: Uint8Array
  protected?: Uint8Array
  recipients: Array<EncodedRecipient>
  tag?: Uint8Array
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
  if (recipient.encrypted_key) encRec.encrypted_key = fromBase64url(recipient.encrypted_key) // eslint-disable-line @typescript-eslint/camelcase
  if (recipient.header) encRec.header = recipient.header
  return encRec
}

function encode(jwe: DagJWE): EncodedJWE {
  const encJwe: EncodedJWE = {
    ciphertext: fromBase64url(jwe.ciphertext),
    recipients: jwe.recipients.map(encodeRecipient),
  }
  if (jwe.aad) encJwe.aad = fromBase64url(jwe.aad)
  if (jwe.iv) encJwe.iv = fromBase64url(jwe.iv)
  if (jwe.protected) encJwe.protected = fromBase64url(jwe.protected)
  if (jwe.tag) encJwe.tag = fromBase64url(jwe.tag)
  if (jwe.unprotected) encJwe.unprotected = jwe.unprotected
  return encJwe
}

function decodeRecipient(encoded: EncodedRecipient): JWERecipient {
  const recipient: JWERecipient = {}
  if (encoded.encrypted_key) recipient.encrypted_key = toBase64url(encoded.encrypted_key) // eslint-disable-line @typescript-eslint/camelcase
  if (encoded.header) recipient.header = encoded.header
  return recipient
}

function decode(encoded: EncodedJWE): DagJWE {
  const jwe: DagJWE = {
    ciphertext: toBase64url(encoded.ciphertext),
    recipients: encoded.recipients.map(decodeRecipient),
  }
  if (encoded.aad) jwe.aad = toBase64url(encoded.aad)
  if (encoded.iv) jwe.iv = toBase64url(encoded.iv)
  if (encoded.protected) jwe.protected = toBase64url(encoded.protected)
  if (encoded.tag) jwe.tag = toBase64url(encoded.tag)
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
