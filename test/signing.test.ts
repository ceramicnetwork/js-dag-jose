import signing, { createDagJWS, verifyDagJWS } from '../src/signing'
import { fromBase64url, toBase64url } from '../src/utils'
import fixtures from './__fixtures__/signing.fixtures'
import * as u8a from 'uint8arrays'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'

describe('Signing support', () => {
  let signer1, signer2

  beforeAll(() => {
    signer1 = new EllipticSigner(fixtures.keys[0].priv)
    signer2 = new EllipticSigner(fixtures.keys[1].priv)
  })

  describe('fromSplit', () => {
    it('Converts split jws to a general jws', () => {
      const compact = fixtures.compact
      expect(signing.fromSplit(compact.split('.'))).toEqual(fixtures.general)
    })
  })

  describe('decode', () => {
    it('Decodes general encoding, one signature', () => {
      let decoded
      decoded = signing.decode(fixtures.encodedJws.oneSig[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[0])

      decoded = signing.decode(fixtures.encodedJws.oneSig[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[1])
    })

    it('Decodes general encoding, multiple signatures', () => {
      const decoded = signing.decode(fixtures.encodedJws.multipleSig)
      expect(decoded).toEqual(fixtures.dagJws.multipleSig)
    })
  })

  describe('encode', () => {
    it('Encodes dag encoding, one signature', () => {
      let encoded
      encoded = signing.encode(fixtures.dagJws.oneSig[0])
      expect(encoded).toEqual(fixtures.encodedJws.oneSig[0])

      encoded = signing.encode(fixtures.dagJws.oneSig[1])
      expect(encoded).toEqual(fixtures.encodedJws.oneSig[1])
    })

    it('Encodes dag encoding, multiple signatures', () => {
      const encoded = signing.encode(fixtures.dagJws.multipleSig)
      expect(encoded).toEqual(fixtures.encodedJws.multipleSig)
    })

    it('Throws if payload is not a CID', async () => {
      const payload = toBase64url(u8a.fromString(JSON.stringify({ json: 'payload' })))
      const notDagJws = Object.assign({}, fixtures.dagJws.oneSig[0], { payload })
      expect(() => signing.encode(notDagJws)).toThrow('Not a valid DagJWS')
    })
  })

  describe('verifyDagJWS', () => {
    it('Verifies single correct signatures', () => {
      let pubkey
      pubkey = verifyDagJWS(fixtures.dagJws.oneSig[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = verifyDagJWS(fixtures.dagJws.oneSig[1], [fixtures.keys[1].pub])
      expect(pubkey).toEqual([fixtures.keys[1].pub])
    })

    it('Verifies multiple correct signatures', () => {
      const pubkeys = verifyDagJWS(fixtures.dagJws.multipleSig, [
        fixtures.keys[0].pub,
        fixtures.keys[1].pub,
      ])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
    })

    it('Verify throw error with wrong pubkey', () => {
      let fn
      fn = (): void => verifyDagJWS(fixtures.dagJws.oneSig[0], [fixtures.keys[1].pub])
      expect(fn).toThrowError(/Signature invalid/)
      fn = (): void => verifyDagJWS(fixtures.dagJws.multipleSig, [fixtures.keys[0].pub])
      expect(fn).toThrowError(/Signature invalid/)
    })
  })

  describe('createDagJWS', () => {
    it('Throws if payload is not a CID', async () => {
      const msg = 'A CID has to be used as a payload'
      let notCID = 'foireufhiuh'
      await expect(createDagJWS(notCID, signer1)).rejects.toThrowError(msg)
      notCID = { my: 'payload' }
      await expect(createDagJWS(notCID, signer1)).rejects.toThrowError(msg)
    })

    it('Creates DagJWS with CID as payload', async () => {
      const cid = new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu')
      let dagJws
      dagJws = await createDagJWS(cid, signer1)
      expect(dagJws).toEqual(fixtures.dagJws.oneSig[0])

      dagJws = await createDagJWS(cid, signer2)
      expect(dagJws).toEqual(fixtures.dagJws.oneSig[1])
    })
  })
})
