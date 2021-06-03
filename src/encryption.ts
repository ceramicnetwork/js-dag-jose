import { fromBase64url, toBase64url } from './utils'

interface JWERecipient {
  encrypted_key?: string
  header?: Record<string, any>
}

export interface DagJWE {
  aad?: string
  ciphertext: string
  iv: string
  protected: string
  recipients?: Array<JWERecipient>
  tag: string
  unprotected?: Record<string, any>
}

interface EncodedRecipient {
  encrypted_key?: Uint8Array
  header?: Record<string, any>
}

export interface EncodedJWE {
  aad?: Uint8Array
  ciphertext: Uint8Array
  iv: Uint8Array
  protected: Uint8Array
  recipients?: Array<EncodedRecipient>
  tag: Uint8Array
  unprotected?: Record<string, any>
}

function fromSplit(split: Array<string>): DagJWE {
  const [protectedHeader, encrypted_key, iv, ciphertext, tag] = split
  const jwe: DagJWE = {
    ciphertext,
    iv,
    protected: protectedHeader,
    tag,
  }
  if (encrypted_key) jwe.recipients = [{ encrypted_key }]
  return jwe
}

function encodeRecipient(recipient: JWERecipient): EncodedRecipient {
  const encRec: EncodedRecipient = {}
  if (recipient.encrypted_key) encRec.encrypted_key = fromBase64url(recipient.encrypted_key)
  if (recipient.header) encRec.header = recipient.header
  return encRec
}

function encode(jwe: DagJWE): EncodedJWE {
  const encJwe: EncodedJWE = {
    ciphertext: fromBase64url(jwe.ciphertext),
    protected: fromBase64url(jwe.protected),
    iv: fromBase64url(jwe.iv),
    tag: fromBase64url(jwe.tag),
  }
  if (jwe.aad) encJwe.aad = fromBase64url(jwe.aad)
  if (jwe.recipients) encJwe.recipients = jwe.recipients.map(encodeRecipient)
  if (jwe.unprotected) encJwe.unprotected = jwe.unprotected
  return encJwe
}

function decodeRecipient(encoded: EncodedRecipient): JWERecipient {
  const recipient: JWERecipient = {}
  if (encoded.encrypted_key) recipient.encrypted_key = toBase64url(encoded.encrypted_key)
  if (encoded.header) recipient.header = encoded.header
  return recipient
}

function decode(encoded: EncodedJWE): DagJWE {
  const jwe: DagJWE = {
    ciphertext: toBase64url(encoded.ciphertext),
    protected: toBase64url(encoded.protected),
    iv: toBase64url(encoded.iv),
    tag: toBase64url(encoded.tag),
  }
  if (encoded.aad) jwe.aad = toBase64url(encoded.aad)
  if (encoded.recipients) jwe.recipients = encoded.recipients.map(decodeRecipient)
  if (encoded.unprotected) jwe.unprotected = encoded.unprotected
  return jwe
}

export default {
  fromSplit,
  decode,
  encode,
}
