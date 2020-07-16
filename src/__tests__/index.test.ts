import dagJose from '../index'
import sFixtures from './__fixtures__/signing.fixtures'
import multiformats from 'multiformats/basics.js'
import legacy from 'multiformats/legacy.js'
import IPLD from 'ipld'
import ipldInMem from 'ipld-in-memory'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'
import stringify from 'fast-json-stable-stringify'


describe('dag-jose codec', () => {
  let signer

  describe('Signing', () => {
    it('Encode string', async () => {
      const encoded = dagJose.encode(sFixtures.compact)
      const expected = Buffer.from(stringify(sFixtures.generalJws.oneSig[0]))
      expect(encoded).toEqual(expected)
    })

    it('Encode general', async () => {
      const encoded = dagJose.encode(sFixtures.generalJws.oneSig[0])
      const expected = Buffer.from(stringify(sFixtures.generalJws.oneSig[0]))
      expect(encoded).toEqual(expected)
    })

    it('Encode dagJose', async () => {
      const encoded = dagJose.encode(sFixtures.dagJws.oneSig[1])
      const expected = Buffer.from(stringify(sFixtures.generalJws.oneSig[1]))
      expect(encoded).toEqual(expected)
    })

    it('Decode Buffer', async () => {
      let decoded
      decoded = dagJose.decode(Buffer.from(stringify(sFixtures.generalJws.oneSig[1])))
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[1])
      decoded = dagJose.decode(Buffer.from(stringify(sFixtures.generalJws.mutipleSigWLinks)))
      expect(decoded).toEqual(sFixtures.dagJws.mutipleSigWLinks)
    })

    it('Decode Uint8Array', async () => {
      let decoded
      decoded = dagJose.decode(new Uint8Array(Buffer.from(stringify(sFixtures.generalJws.oneSig[1]))))
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[1])
      decoded = dagJose.decode(new Uint8Array(Buffer.from(stringify(sFixtures.generalJws.mutipleSigWLinks))))
      expect(decoded).toEqual(sFixtures.dagJws.mutipleSigWLinks)
    })

    it.skip('IPLD integration', async () => {
      const ipld = await ipldInMem(IPLD)
      multiformats.multicodec.add(dagJose)
      const format = legacy(multiformats, dagJose.name)
      ipld.addFormat(format)
      signer = new EllipticSigner(sFixtures.keys[0].priv)
      const { payload } = sFixtures.dagJws.oneSig[0]
      const dagJws = await dagJose.signing.create(payload, signer)
      expect(dagJws).toEqual(sFixtures.dagJws.oneSig[0])
      const cid = await ipld.put(dagJws, format.codec)
      expect(cid).toEqual(new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq'))
      const data = await ipld.get(cid)
      expect(data).toEqual(sFixtures.dagJws.oneSig[0])
    })
  })

  describe.skip('Encryption', () => {
    it('Encode string', async () => {
      // TODO
    })

    it('Encode general', async () => {
      // TODO
    })

    it('Encode dagJose', async () => {
      // TODO
    })

    it('Decode Buffer', async () => {
      // test with Uint8Array and Buffer
      //console.log('asdf')
    })

    it('Decode Uint8Array', async () => {
      // TODO
    })
  })

  it('Encode throws error with invalid object', async () => {
    const notJose = { aa: 'bb' }
    expect(() => dagJose.encode(notJose)).toThrowError('Not a valid JOSE object')
  })

  it('Decode throws error with invalid object', async () => {
    const notJose = JSON.stringify({ aa: 'bb' })
    expect(() => dagJose.decode(notJose)).toThrowError('Not a valid DAG-JOSE object')
  })
})
