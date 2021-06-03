/* eslint-env jest */

import encryption from '../src/encryption'
import { DagJWE } from '../src/index'
import fixtures from './__fixtures__/encryption.fixtures'
import { CID } from 'multiformats/cid'
import {
  xc20pDirEncrypter,
  xc20pDirDecrypter,
  x25519Encrypter,
  x25519Decrypter,
  createJWE,
  decryptJWE,
  Encrypter,
  Decrypter
} from 'did-jwt'
import { generateKeyPairFromSeed } from '@stablelib/x25519'

async function createDagJWE(
  cid: CID,
  encrypters: Array<Encrypter>,
  header?: Record<string, any>,
  aad?: Uint8Array
): Promise<DagJWE> {
  cid = CID.asCID(cid)
  if (!cid) throw new Error('A CID has to be used as a payload')
  return createJWE(cid.bytes, encrypters, header, aad)
}

async function decryptDagJWE(jwe: DagJWE, decrypter: Decrypter): Promise<CID> {
  const cidBytes = await decryptJWE(jwe as any, decrypter)
  return CID.decode(cidBytes)
}

describe('Encryption support', () => {
  let encrypter1, encrypter2, encrypter3
  let decrypter1, decrypter2, decrypter3

  beforeAll(() => {
    encrypter1 = xc20pDirEncrypter(fixtures.keys[0])
    decrypter1 = xc20pDirDecrypter(fixtures.keys[0])
    const pubKey2 = generateKeyPairFromSeed(fixtures.keys[1]).publicKey
    const pubKey3 = generateKeyPairFromSeed(fixtures.keys[2]).publicKey
    encrypter2 = x25519Encrypter(pubKey2)
    encrypter3 = x25519Encrypter(pubKey3)
    decrypter2 = x25519Decrypter(fixtures.keys[1])
    decrypter3 = x25519Decrypter(fixtures.keys[2])
  })

  describe('fromSplit', () => {
    it('Converts split jwe to a general jws', () => {
      const compact = fixtures.compact
      expect(encryption.fromSplit(compact.split('.'))).toEqual(fixtures.dagJwe.dir)
    })
  })

  describe('decode', () => {
    it('Decodes general encoding, one recipient', () => {
      let decoded
      decoded = encryption.decode(fixtures.encodedJwe.dir)
      expect(decoded).toEqual(fixtures.dagJwe.dir)

      decoded = encryption.decode(fixtures.encodedJwe.oneRecip)
      expect(decoded).toEqual(fixtures.dagJwe.oneRecip)
    })

    it('Decodes general encoding, multiple recipients', () => {
      const decoded = encryption.decode(fixtures.encodedJwe.multipleRecip)
      expect(decoded).toEqual(fixtures.dagJwe.multipleRecip)
    })
  })

  describe('encode', () => {
    it('Encodes dag encoding, one recipient', () => {
      let encoded
      encoded = encryption.encode(fixtures.dagJwe.dir)
      expect(encoded).toEqual(fixtures.encodedJwe.dir)

      encoded = encryption.encode(fixtures.dagJwe.oneRecip)
      expect(encoded).toEqual(fixtures.encodedJwe.oneRecip)
    })

    it('Encodes dag encoding, multiple recipients', () => {
      const encoded = encryption.encode(fixtures.dagJwe.multipleRecip)
      expect(encoded).toEqual(fixtures.encodedJwe.multipleRecip)
    })
  })

  describe('createDagJWE and decryptDagJWE', () => {
    const cleartextCID = CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu')
    it('Throws if payload is not a CID', async () => {
      const msg = 'A CID has to be used as a payload'
      let notCID = 'foireufhiuh'
      // @ts-ignore
      await expect(createDagJWE(notCID, [encrypter1])).rejects.toThrowError(msg)
      // @ts-ignore
      notCID = { my: 'payload' }
      // @ts-ignore
      await expect(createDagJWE(notCID, [encrypter1])).rejects.toThrowError(msg)
    })

    it('Creates DagJWE and decrypts it with direct encryption', async () => {
      const jwe = await createDagJWE(cleartextCID, [encrypter1])
      expect(jwe.protected).toBeDefined()
      expect(jwe.iv).toBeDefined()
      expect(jwe.tag).toBeDefined()
      expect(jwe.ciphertext).toBeDefined()
      expect(jwe.recipients).toBeUndefined()
      expect(await decryptDagJWE(jwe, decrypter1)).toEqual(cleartextCID)
    })

    it('Creates DagJWE and decrypts it with asymmetric encryption', async () => {
      const jwe = await createDagJWE(cleartextCID, [encrypter2])
      expect(jwe.protected).toBeDefined()
      expect(jwe.iv).toBeDefined()
      expect(jwe.tag).toBeDefined()
      expect(jwe.ciphertext).toBeDefined()
      expect(jwe.recipients).toBeDefined()
      expect(jwe.recipients.length).toEqual(1)
      expect(await decryptDagJWE(jwe, decrypter2)).toEqual(cleartextCID)
    })

    it('Creates DagJWE and decrypts it with asymmetric encryption (multiple recipients)', async () => {
      const jwe = await createDagJWE(cleartextCID, [encrypter2, encrypter3])
      expect(jwe.protected).toBeDefined()
      expect(jwe.iv).toBeDefined()
      expect(jwe.tag).toBeDefined()
      expect(jwe.ciphertext).toBeDefined()
      expect(jwe.recipients).toBeDefined()
      expect(jwe.recipients.length).toEqual(2)
      expect(await decryptDagJWE(jwe, decrypter2)).toEqual(cleartextCID)
      expect(await decryptDagJWE(jwe, decrypter3)).toEqual(cleartextCID)
    })
  })
})
