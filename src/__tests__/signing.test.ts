import signing, { createDagJWS, verifyDagJWS } from '../signing'
import fixtures from './__fixtures__/signing.fixtures'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'


describe('Signing support', () => {
  let signer1, signer2

  beforeAll(() => {
    signer1 = new EllipticSigner(fixtures.keys[0].priv)
    signer2 = new EllipticSigner(fixtures.keys[1].priv)
  })

  describe('fromSplit', () => {
    it('Converts split jws to a general jws', async () => {
      const compact = fixtures.compact
      expect(signing.fromSplit(compact.split('.'))).toEqual(fixtures.general)
    })

  })

  describe('decode', () => {
    it('Decodes general encoding, one signature', async () => {
      let decoded
      decoded = signing.decode(fixtures.encodedJws.oneSig[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[0])

      decoded = signing.decode(fixtures.encodedJws.oneSig[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[1])
    })

    it('Decodes general encoding, multiple signatures', async () => {
      const decoded = signing.decode(fixtures.encodedJws.multipleSig)
      expect(decoded).toEqual(fixtures.dagJws.multipleSig)
    })
  })

  describe('encode', () => {
    it('Encodes dag encoding, one signature', async () => {
      let encoded
      encoded = signing.encode(fixtures.dagJws.oneSig[0])
      expect(encoded).toEqual(fixtures.encodedJws.oneSig[0])

      encoded = signing.encode(fixtures.dagJws.oneSig[1])
      expect(encoded).toEqual(fixtures.encodedJws.oneSig[1])
    })

    it('Encodes dag encoding, multiple signatures', async () => {
      const encoded = signing.encode(fixtures.dagJws.multipleSig)
      expect(encoded).toEqual(fixtures.encodedJws.multipleSig)
    })
  })

  describe('verifyDagJWS', () => {
    it('Verifies single correct signatures', async () => {
      let pubkey
      pubkey = verifyDagJWS(fixtures.dagJws.oneSig[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = verifyDagJWS(fixtures.dagJws.oneSig[1], [fixtures.keys[1].pub])
      expect(pubkey).toEqual([fixtures.keys[1].pub])
    })

    it('Verifies multiple correct signatures', async () => {
      const pubkeys = verifyDagJWS(fixtures.dagJws.multipleSig, [fixtures.keys[0].pub, fixtures.keys[1].pub])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
    })

    it('Verify throw error with wrong pubkey', async () => {
      let fn
      fn = (): void => verifyDagJWS(fixtures.dagJws.oneSig[0], [fixtures.keys[1].pub])
      expect(fn).toThrowError(/Signature invalid/)
      fn = (): void => verifyDagJWS(fixtures.dagJws.multipleSig, [fixtures.keys[0].pub])
      expect(fn).toThrowError(/Signature invalid/)
    })
  })

  describe('createDagJWS', () => {
    it('Throws if payload is not a CID', async () => {
      let notCID = 'foireufhiuh'
      await expect(createDagJWS(notCID, signer1)).rejects.toThrowError('A CID has to be used as a payload')
      notCID = { my: 'payload' }
      await expect(createDagJWS(notCID, signer1)).rejects.toThrowError('A CID has to be used as a payload')
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
