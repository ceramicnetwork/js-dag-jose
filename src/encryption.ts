/*eslint-disable */
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
  throw new Error('Not implemented')
}

function encode(jwe: DagJWE): EncodedJWE {
  throw new Error('Not implemented')
}

function decodeRecipient(encoded: EncodedRecipient): JWERecipient {
  throw new Error('Not implemented')
}

function decode(encoded: EncodedJWE): DagJWE {
  throw new Error('Not implemented')
}

export async function createDagJWE(payload: any, header: any, encrypt: Encrypter): Promise<DagJWE> {
  throw new Error('Not implemented')
  // TODO - Implement JWE creation with x25519 + xchacha20-poly1305
}

export async function decryptDagJWE(node: DagJWE, decrypt: Decrypter): Promise<any> {
  throw new Error('Not implemented')
  // TODO - Implement JWE decryption
}

export default {
  fromSplit,
  decode,
  encode,
}
/*eslint-enable */
