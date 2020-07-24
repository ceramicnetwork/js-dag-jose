interface GeneralRecipient {
  encrypted_key?: string
  header?: Record<string, any>
}

interface GeneralJWE {
  aad?: string
  ciphertext: string
  iv?: string
  protected?: string
  recipients: Array<GeneralRecipient>
  tag?: string
  unprotected?: Record<string, any>
}

interface DagRecipient {
  encrypted_key?: Buffer
  header?: Record<string, any>
}

interface DagJWE {
  aad?: Buffer
  ciphertext: Buffer
  iv?: Buffer
  protected?: Record<string, any>
  recipients: Array<DagRecipient>
  tag?: Buffer
  unprotected?: Record<string, any>
}

type Encrypter = (data: string) => any // TODO - stricter types
type Decrypter = (data: string) => any // TODO - stricter types

function fromSplit(split: Array<string>): GeneralJWE {
  throw new Error('Not implemented')
  //const [protected, encrypted_key, iv, ciphertext, tag] = split
  //return {
  //ciphertext,
  //iv,
  //protected,
  //recipients: [{ encrypted_key }],
  //tag
  //}
}

function encodeRecipient(parsed: DagRecipient): GeneralRecipient {
  throw new Error('Not implemented')
}

function encode(jws: DagJWE | GeneralJWE): GeneralJWE {
  throw new Error('Not implemented')
}

function decodeRecipient(parsed: GeneralRecipient): DagRecipient {
  throw new Error('Not implemented')
}

function decode(parsed: GeneralJWE): DagJWE {
  throw new Error('Not implemented')
}

async function create(
  payload: any,
  header: any,
  encrypt: Encrypter,
): Promise<DagJWE> {
  throw new Error('Not implemented')
  // TODO - Implement JWE creation with x25519 + xchacha20-poly1305
}

async function decrypt(node: DagJWE, decrypt: Decrypter): Promise<any> {
  throw new Error('Not implemented')
  // TODO - Implement JWE decryption
}

export default {
  fromSplit,
  decode,
  encode,
  create,
  decrypt,
}
export { GeneralJWE, DagJWE }
