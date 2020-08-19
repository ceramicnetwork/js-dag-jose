import dagJose, { createDagJWS } from '../src/index'
import sFixtures from './__fixtures__/signing.fixtures'
// TODO - multiformats imports not working, ignoring for now.
//import multiformats from 'multiformats'
//import legacy from 'multiformats/legacy.js'
import IPLD from 'ipld'
import ipldInMem from 'ipld-in-memory'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'

describe('dag-jose codec', () => {
  describe('DagJWS', () => {
    it('Encode compact jws', () => {
      const encoded = dagJose.encode(sFixtures.compact)
      expect(encoded).toEqual(sFixtures.blockEncoded.oneSig[0])
    })

    it('Encode general jws', () => {
      let encoded = dagJose.encode(sFixtures.dagJws.oneSig[0])
      expect(encoded).toEqual(sFixtures.blockEncoded.oneSig[0])

      encoded = dagJose.encode(sFixtures.dagJws.oneSig[1])
      expect(encoded).toEqual(sFixtures.blockEncoded.oneSig[1])

      encoded = dagJose.encode(sFixtures.dagJws.multipleSig)
      expect(encoded).toEqual(sFixtures.blockEncoded.multipleSig)
    })

    it('Decode Buffer', () => {
      let decoded
      decoded = dagJose.decode(sFixtures.blockEncoded.oneSig[0])
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[0])

      decoded = dagJose.decode(sFixtures.blockEncoded.multipleSig)
      expect(decoded).toEqual(sFixtures.dagJws.multipleSig)
    })

    it('Decode Uint8Array', () => {
      let decoded
      decoded = dagJose.decode(new Uint8Array(sFixtures.blockEncoded.oneSig[1]))
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[1])
      decoded = dagJose.decode(new Uint8Array(sFixtures.blockEncoded.multipleSig))
      expect(decoded).toEqual(sFixtures.dagJws.multipleSig)
    })

    it.skip('IPLD integration', async () => {
      const ipld = await ipldInMem(IPLD)
      multiformats.multicodec.add(dagJose)
      const format = legacy(multiformats, dagJose.name)
      ipld.addFormat(format)
      const signer = new EllipticSigner(sFixtures.keys[0].priv)
      const cidPayload = new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')
      const dagJws = await createDagJWS(cidPayload, signer)
      const cid = await ipld.put(dagJws, format.codec)
      expect(cid).toEqual(new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq'))
      const data = await ipld.get(cid)
      expect(data).toEqual(sFixtures.dagJws.oneSig[0])
    })
  })

  describe.skip('DagJWE', () => {
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

  it('Encode throws error with invalid object', () => {
    const notJose = { aa: 'bb' }
    expect(() => dagJose.encode(notJose)).toThrowError('Not a valid JOSE object')
  })

  it('Decode throws error with invalid object', () => {
    const notJose = JSON.stringify({ aa: 'bb' })
    expect(() => dagJose.decode(notJose)).toThrowError('Not a valid DAG-JOSE object')
  })
})
