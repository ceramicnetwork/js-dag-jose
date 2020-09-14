import encryption, { createDagJWE, decryptDagJWE } from '../src/encryption'
import fixtures from './__fixtures__/encryption.fixtures'
//import CID from 'cids'
//import { EllipticSigner } from 'did-jwt'

describe('Encryption support', () => {
  //let signer1, signer2

  beforeAll(() => {
    //signer1 = new EllipticSigner(fixtures.keys[0].priv)
    //signer2 = new EllipticSigner(fixtures.keys[1].priv)
  })

  describe('fromSplit', () => {
    it('Converts split jwe to a general jws', () => {
      const compact = fixtures.compact
      expect(encryption.fromSplit(compact.split('.'))).toEqual(fixtures.general)
    })
  })

  describe('decode', () => {
    it('Decodes general encoding, one recipient', () => {
      let decoded
      decoded = encryption.decode(fixtures.encodedJwe.oneRecip[0])
      expect(decoded).toEqual(fixtures.dagJwe.oneRecip[0])

      decoded = encryption.decode(fixtures.encodedJwe.oneRecip[1])
      expect(decoded).toEqual(fixtures.dagJwe.oneRecip[1])
    })

    it('Decodes general encoding, multiple recipients', () => {
      const decoded = encryption.decode(fixtures.encodedJwe.multipleRecip)
      expect(decoded).toEqual(fixtures.dagJwe.multipleRecip)
    })
  })

  describe('encode', () => {
    it('Encodes dag encoding, one recipient', () => {
      let encoded
      encoded = encryption.encode(fixtures.dagJwe.oneRecip[0])
      expect(encoded).toEqual(fixtures.encodedJwe.oneRecip[0])

      encoded = encryption.encode(fixtures.dagJwe.oneRecip[1])
      expect(encoded).toEqual(fixtures.encodedJwe.oneRecip[1])
    })

    it('Encodes dag encoding, multiple recipients', () => {
      const encoded = encryption.encode(fixtures.dagJwe.multipleRecip)
      expect(encoded).toEqual(fixtures.encodedJwe.multipleRecip)
    })
  })

  describe.skip('decryptDagJWE', () => {
  })

  describe.skip('createDagJWE', () => {
  })
})
