import { randomBytes } from '@stablelib/random'
import { generateKeyPairFromSeed } from '@stablelib/x25519'

// IPLD & IPFS
import { create as createIpfs } from 'ipfs'
import { convert as toLegacyIpld } from 'blockcodec-to-ipld-format'

// JWT & utilities
import {
  xc20pDirEncrypter,
  xc20pDirDecrypter,
  x25519Encrypter,
  x25519Decrypter,
  decryptJWE,
  createJWE
} from 'did-jwt'
import {
  decodeCleartext,
  prepareCleartext
} from 'dag-jose-utils'

import * as dagJose from './lib/index.js'

// Translate DAG-JOSE into the IPLD interface js-IPFS understands
const dagJoseIpldFormat = toLegacyIpld(dagJose)
let ipfs

// Async setup tasks
async function setup () {
  console.log('Starting IPFS ...')
  // Instantiate an IPFS node, that knows how to deal with DAG-JOSE blocks
  ipfs = await createIpfs({ ipld: { formats: [dagJoseIpldFormat] } })
}

async function symmetric () {
  // Encrypt and store a payload using a secret key
  const storeEncrypted = async (payload, key) => {
    const dirEncrypter = xc20pDirEncrypter(key)
    // prepares a cleartext object to be encrypted in a JWE
    const cleartext = await prepareCleartext(payload)
    // encrypt into JWE container layout using secret key
    const jwe = await createJWE(cleartext, [dirEncrypter])
    // let IPFS store the bytes using the DAG-JOSE codec and return a CID
    const cid = await ipfs.dag.put(jwe, { format: dagJoseIpldFormat.codec, hashAlg: 'sha2-256' })
    console.log(`Encrypted block CID: \u001b[32m${cid}\u001b[39m`)
    return cid
  }

  // Load an encrypted block from a CID and decrypt the payload using a secret key
  const loadEncrypted = async (cid, key) => {
    const dirDecrypter = xc20pDirDecrypter(key)
    const retrieved = await ipfs.dag.get(cid)
    const decryptedData = await decryptJWE(retrieved.value, dirDecrypter)
    return decodeCleartext(decryptedData)
  }

  const key = randomBytes(32)
  const secretz = { my: 'secret message' }
  console.log('Encrypting and storing secret:\u001b[1m', secretz, '\u001b[22m')
  const cid = await storeEncrypted(secretz, key)
  const decoded = await loadEncrypted(cid, key)
  console.log('Loaded and decrypted block content:\u001b[1m', decoded, '\u001b[22m')
}

// Asymmetric encryption using a private and public key
async function asymmetric () {
  // Encrypt and store a payload using a public key
  const storeEncrypted = async (payload, pubkey) => {
    const asymEncrypter = x25519Encrypter(pubkey)
    // prepares a cleartext object to be encrypted in a JWE
    const cleartext = await prepareCleartext(payload)
    // encrypt into JWE container layout using public key
    const jwe = await createJWE(cleartext, [asymEncrypter])
    // let IPFS store the bytes using the DAG-JOSE codec and return a CID
    const cid = await ipfs.dag.put(jwe, { format: dagJoseIpldFormat.codec, hashAlg: 'sha2-256' })
    console.log(`Encrypted block CID: \u001b[32m${cid}\u001b[39m`)
    return cid
  }

  // Load an encrypted block from a CID and decrypt the payload using a secret key
  const loadEncrypted = async (cid, privkey) => {
    const asymDecrypter = x25519Decrypter(privkey)
    // decode the DAG-JOSE envelope
    const retrieved = await ipfs.dag.get(cid)
    const decryptedData = await decryptJWE(retrieved.value, asymDecrypter)
    return decodeCleartext(decryptedData)
  }

  const privkey = randomBytes(32)
  // generate a public key from the existing private key
  const pubkey = generateKeyPairFromSeed(privkey).publicKey
  const secretz = { my: 'secret message' }
  console.log('Encrypting and storing secret with public key:\u001b[1m', secretz, '\u001b[22m')
  const cid = await storeEncrypted(secretz, pubkey)
  const decoded = await loadEncrypted(cid, privkey)
  console.log('Loaded and decrypted block content with private key:\u001b[1m', decoded, '\u001b[22m')
}

// Run!
setup().then(() => {
  console.log('Running symmetric example...')
  symmetric().then(async () => {
    console.log('Running asymmetric example...')
    await asymmetric()
    process.exit(0)
  })
}).catch((e) => {
  console.error(e.stack)
  process.exit(1)
})
