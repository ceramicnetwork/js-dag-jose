import { randomBytes } from '@stablelib/random'
import { generateKeyPairFromSeed } from '@stablelib/x25519'

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

import * as Block from 'multiformats/block'
import { sha256 } from 'multiformats/hashes/sha2'
import * as dagJose from './lib/index.js'

/** @type {Map<string, Uint8Array>} */
const store = new Map()

async function symmetric () {
  // Encrypt and store a payload using a secret key
  const storeEncrypted = async (payload, key) => {
    const dirEncrypter = xc20pDirEncrypter(key)
    // prepares a cleartext object to be encrypted in a JWE
    const cleartext = await prepareCleartext(payload)
    // encrypt into JWE container layout using secret key
    const jwe = await createJWE(cleartext, [dirEncrypter])
    // create an IPLD Block that has the CID:Bytes:Value triple
    const block = await Block.encode({ value: jwe, codec: dagJose, hasher: sha256 })
    console.log(`Encrypted block CID: \u001b[32m${block.cid}\u001b[39m`)
    console.log('Encrypted block contents:\n', block.value)
    // store the block, this could be in IPFS or any other CID:Bytes block store
    store.set(block.cid.toString(), block.bytes)
    return block.cid
  }

  // Load an encrypted block from a CID and decrypt the payload using a secret key
  const loadEncrypted = async (cid, key) => {
    const dirDecrypter = xc20pDirDecrypter(key)
    const bytes = store.get(cid.toString())
    // decode the DAG-JOSE envelope and verify the bytes match the CID
    const block = await Block.create({ bytes, cid, codec: dagJose, hasher: sha256 })
    // decrypt the encrypted payload
    const decryptedData = await decryptJWE(block.value, dirDecrypter)
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
    // create an IPLD Block that has the CID:Bytes:Value triple
    const block = await Block.encode({ value: jwe, codec: dagJose, hasher: sha256 })
    console.log(`Encrypted block CID: \u001b[32m${block.cid}\u001b[39m`)
    console.log('Encrypted block contents:\n', block.value)
    // store the block, this could be in IPFS or any other CID:Bytes block store
    store.set(block.cid.toString(), block.bytes)
    return block.cid
  }

  // Load an encrypted block from a CID and decrypt the payload using a secret key
  const loadEncrypted = async (cid, privkey) => {
    const asymDecrypter = x25519Decrypter(privkey)
    const bytes = store.get(cid.toString())
    // decode the DAG-JOSE envelope
    const block = await Block.create({ bytes, cid, codec: dagJose, hasher: sha256 })
    if (!block.cid.equals(cid)) {
      throw new Error('CID mismatch')
    }
    // decrypt the encrypted payload
    const decryptedData = await decryptJWE(block.value, asymDecrypter)
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
console.log('Running symmetric example...')
symmetric().then(async () => {
  console.log('Running asymmetric example...')
  await asymmetric()
}).catch((e) => {
  console.error(e.stack)
  process.exit(1)
})
