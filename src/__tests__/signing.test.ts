import signing from '../signing'
import fixtures from './__fixtures__/signing.fixtures'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'


describe('Signing support', () => {
  let signer1

  beforeAll(() => {
    signer1 = new EllipticSigner(fixtures.keys[0].priv)
  })

  describe('Decoding', () => {
    it('Decodes from compact encoding', async () => {
      const compact = fixtures.compact
      expect(signing.fromSplit(compact.split('.'))).toEqual(fixtures.generalJws.oneSig[0])
    })

    it('Decodes general encoding, one signature', async () => {
      let decoded
      decoded = signing.decode(fixtures.generalJws.oneSig[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[0])

      decoded = signing.decode(fixtures.generalJws.oneSig[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[1])

      decoded = signing.decode(fixtures.generalJws.oneSigWLinks[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSigWLinks[0])

      decoded = signing.decode(fixtures.generalJws.oneSigWLinks[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSigWLinks[1])
    })

    it('Decodes general encoding, multiple signatures', async () => {
      let decoded
      decoded = signing.decode(fixtures.generalJws.mutipleSig)
      expect(decoded).toEqual(fixtures.dagJws.mutipleSig)

      decoded = signing.decode(fixtures.generalJws.mutipleSigWLinks)
      expect(decoded).toEqual(fixtures.dagJws.mutipleSigWLinks)
    })
  })

  describe('Encoding', () => {
    it('Encodes dag encoding, one signature', async () => {
      let encoded
      encoded = signing.encode(fixtures.dagJws.oneSig[0])
      expect(encoded).toEqual(fixtures.generalJws.oneSig[0])

      encoded = signing.encode(fixtures.dagJws.oneSig[1])
      expect(encoded).toEqual(fixtures.generalJws.oneSig[1])

      encoded = signing.encode(fixtures.dagJws.oneSigWLinks[0])
      expect(encoded).toEqual(fixtures.generalJws.oneSigWLinks[0])

      encoded = signing.encode(fixtures.dagJws.oneSigWLinks[1])
      expect(encoded).toEqual(fixtures.generalJws.oneSigWLinks[1])
    })

    it('Encodes dag encoding, multiple signatures', async () => {
      let encoded
      encoded = signing.encode(fixtures.dagJws.mutipleSig)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSig)

      encoded = signing.encode(fixtures.dagJws.mutipleSigWLinks)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSigWLinks)
    })

    it('Encodes general encoding, multiple signatures', async () => {
      let encoded
      encoded = signing.encode(fixtures.generalJws.mutipleSig)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSig)

      encoded = signing.encode(fixtures.generalJws.mutipleSigWLinks)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSigWLinks)
    })
  })

  describe('Verifying', () => {
    it('Verifies single correct signatures', async () => {
      let pubkey
      pubkey = signing.verify(fixtures.dagJws.oneSig[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = signing.verify(fixtures.dagJws.oneSig[1], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = signing.verify(fixtures.dagJws.oneSigWLinks[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = signing.verify(fixtures.dagJws.oneSigWLinks[1], [fixtures.keys[1].pub])
      expect(pubkey).toEqual([fixtures.keys[1].pub])
    })

    it('Verifies multiple correct signatures', async () => {
      let pubkeys
      pubkeys = signing.verify(fixtures.dagJws.mutipleSig, [fixtures.keys[0].pub, fixtures.keys[1].pub])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
      pubkeys = signing.verify(fixtures.dagJws.mutipleSigWLinks, [fixtures.keys[1].pub, fixtures.keys[0].pub])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
    })

    it('Verify throw error with wrong pubkey', async () => {
      let fn
      fn = (): void => signing.verify(fixtures.dagJws.oneSigWLinks[0], [fixtures.keys[1].pub])
      expect(fn).toThrowError(/Signature invalid/)
      fn = (): void => signing.verify(fixtures.dagJws.mutipleSigWLinks, [fixtures.keys[0].pub])
      expect(fn).toThrowError(/Signature invalid/)
    })
  })

  describe('Verifying', () => {
    it('creates with simple payload', async () => {
      let dagJws
      dagJws = await signing.create({ a: 1, b: 2 }, signer1)
      expect(dagJws).toEqual(fixtures.dagJws.oneSig[0])
      // should reorder payload
      dagJws = await signing.create({ b: 2, a: 1 }, signer1)
      expect(dagJws).toEqual(fixtures.dagJws.oneSig[0])
      // should handle links and buffers in payload
      dagJws = await signing.create({
        b: new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
        a: Buffer.from('11', 'hex')
      }, signer1)
      expect(dagJws).toEqual(fixtures.dagJws.oneSigWLinks[0])
    })
  })
})
