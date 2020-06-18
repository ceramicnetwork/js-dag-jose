import jws, { GeneralJWS, DagJWS } from '../jws'
import { toDagJson, fromDagJson } from '../utils'
import fixtures from './__fixtures__/jws.fixtures.ts'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'
import { createJWS } from 'did-jwt'

const FAKE_CID_1 = new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu')
const FAKE_CID_2 = new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsv')

describe('JWS support', () => {
  let signer1, signer2

  beforeAll(() => {
    signer1 = new EllipticSigner(fixtures.keys[0].priv)
    signer2 = new EllipticSigner(fixtures.keys[1].priv)
  })

  describe('Decoding', () => {
    it('Decodes from compact encoding', async () => {
      const compact = fixtures.compact
      expect(jws.fromSplit(compact.split('.'))).toEqual(fixtures.generalJws.oneSig[0])
    })

    it('Decodes general encoding, one signature', async () => {
      let decoded
      decoded = jws.decode(fixtures.generalJws.oneSig[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[0])

      decoded = jws.decode(fixtures.generalJws.oneSig[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSig[1])

      decoded = jws.decode(fixtures.generalJws.oneSigWLinks[0])
      expect(decoded).toEqual(fixtures.dagJws.oneSigWLinks[0])

      decoded = jws.decode(fixtures.generalJws.oneSigWLinks[1])
      expect(decoded).toEqual(fixtures.dagJws.oneSigWLinks[1])
    })

    it('Decodes general encoding, multiple signatures', async () => {
      let decoded
      decoded = jws.decode(fixtures.generalJws.mutipleSig)
      expect(decoded).toEqual(fixtures.dagJws.mutipleSig)

      decoded = jws.decode(fixtures.generalJws.mutipleSigWLinks)
      expect(decoded).toEqual(fixtures.dagJws.mutipleSigWLinks)
    })
  })

  describe('Encoding', () => {
    it('Encodes dag encoding, one signature', async () => {
      let encoded
      encoded = jws.encode(fixtures.dagJws.oneSig[0])
      expect(encoded).toEqual(fixtures.generalJws.oneSig[0])

      encoded = jws.encode(fixtures.dagJws.oneSig[1])
      expect(encoded).toEqual(fixtures.generalJws.oneSig[1])

      encoded = jws.encode(fixtures.dagJws.oneSigWLinks[0])
      expect(encoded).toEqual(fixtures.generalJws.oneSigWLinks[0])

      encoded = jws.encode(fixtures.dagJws.oneSigWLinks[1])
      expect(encoded).toEqual(fixtures.generalJws.oneSigWLinks[1])
    })

    it('Encodes dag encoding, multiple signatures', async () => {
      let encoded
      encoded = jws.encode(fixtures.dagJws.mutipleSig)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSig)

      encoded = jws.encode(fixtures.dagJws.mutipleSigWLinks)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSigWLinks)
    })

    it('Encodes general encoding, multiple signatures', async () => {
      let encoded
      encoded = jws.encode(fixtures.generalJws.mutipleSig)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSig)

      encoded = jws.encode(fixtures.generalJws.mutipleSigWLinks)
      expect(encoded).toEqual(fixtures.generalJws.mutipleSigWLinks)
    })
  })

  describe('Verifying', () => {
    it('Verifies single correct signatures', async () => {
      let pubkey
      pubkey = jws.verify(fixtures.dagJws.oneSig[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = jws.verify(fixtures.dagJws.oneSig[1], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = jws.verify(fixtures.dagJws.oneSigWLinks[0], [fixtures.keys[0].pub])
      expect(pubkey).toEqual([fixtures.keys[0].pub])
      pubkey = jws.verify(fixtures.dagJws.oneSigWLinks[1], [fixtures.keys[1].pub])
      expect(pubkey).toEqual([fixtures.keys[1].pub])
    })

    it('Verifies multiple correct signatures', async () => {
      let pubkeys
      pubkeys = jws.verify(fixtures.dagJws.mutipleSig, [fixtures.keys[0].pub, fixtures.keys[1].pub])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
      pubkeys = jws.verify(fixtures.dagJws.mutipleSigWLinks, [fixtures.keys[1].pub, fixtures.keys[0].pub])
      expect(pubkeys).toEqual([fixtures.keys[0].pub, fixtures.keys[1].pub])
    })

    it('Verify throw error with wrong pubkey', async () => {
      let fn
      fn = () => jws.verify(fixtures.dagJws.oneSigWLinks[0], [fixtures.keys[1].pub])
      expect(fn).toThrowError(/Signature invalid/)
      fn = () => jws.verify(fixtures.dagJws.mutipleSigWLinks, [fixtures.keys[0].pub])
      expect(fn).toThrowError(/Signature invalid/)
    })
  })

  describe('Verifying', () => {
    it('creates with simple payload', async () => {
      let buf
      let generalJws
      buf = await jws.create({ a: 1, b: 2 }, signer1)
      generalJws = JSON.parse(buf)
      expect(generalJws).toEqual(fixtures.generalJws.oneSig[0])
      // should reorder payload
      buf = await jws.create({ b: 2, a: 1 }, signer1)
      generalJws = JSON.parse(buf)
      expect(generalJws).toEqual(fixtures.generalJws.oneSig[0])
      // should handle links and buffers in payload
      buf = await jws.create({ b: FAKE_CID_1, a: Buffer.from('11', 'hex') }, signer1)
      generalJws = JSON.parse(buf)
      expect(generalJws).toEqual(fixtures.generalJws.oneSigWLinks[0])
    })
  })
})
