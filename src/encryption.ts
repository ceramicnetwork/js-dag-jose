interface GeneralRecipient {
  encrypted_key?: string;
  header?: Object;
}

interface GeneralJWE {
  aad?: string;
  ciphertext: string;
  iv?: string;
  protected?: string;
  recipients: Array<GeneralRecipient>;
  tag?: string;
  unprotected?: Object;
}

interface DagRecipient {
  encrypted_key?: Buffer;
  header?: Object;
}

interface DagJWE {
  aad?: Buffer;
  ciphertext: Buffer;
  iv?: Buffer;
  protected?: Object;
  recipients: Array<DagRecipient>;
  tag?: Buffer;
  unprotected?: Object;
}

type Encrypter = (data: string) => any // TODO - stricter types
type Decrypter = (data: string) => any // TODO - stricter types

function fromSplit (split: Array<string>): GeneralJWE {
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

function encodeRecipient (parsed: DagRecipient): GeneralRecipient {
  throw new Error('Not implemented')
}

function encode (jws: DagJWE | GeneralJWE): GeneralJWE {
  throw new Error('Not implemented')
}

function decodeRecipient (parsed: GeneralRecipient): DagRecipient {
  throw new Error('Not implemented')
}

function decode (parsed: GeneralJWE): DagJWE {
  throw new Error('Not implemented')
}

async function create (payload: any, header: any, encrypt: Encrypter): Promise<Buffer> {
  throw new Error('Not implemented')
  // TODO - Implement JWE creation with x25519 + xchacha20-poly1305
  return {}
}

async function decrypt (node: JOSENode, decrypt: Decrypter): Promise<any> {
  throw new Error('Not implemented')
  // TODO - Implement JWE decryption
  return {}
}

export default {
  fromSplit,
  decode,
  encode,
  create,
  decrypt
}
export {
  GeneralJWE,
  DagJWE
}
