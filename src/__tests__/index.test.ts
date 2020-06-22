import * as dagJose from '../index'
import fixtures from './__fixtures__/signing.fixtures'
import multiformats from 'multiformats/basics.js'
import legacy from 'multiformats/legacy.js'
import IPLD from 'ipld'
import ipldInMem from 'ipld-in-memory'
import CID from 'cids'
import { EllipticSigner } from 'did-jwt'


describe('dag-jose codec', () => {
  let ipld, signer

  beforeAll(async () => {
    //const ipld = await ipldInMem(IPLD)
    //multiformats.multicodec.add(dagJose)
    ////console.log(multiformats.multicodec)
    //const format = legacy(multiformats, dagJose.name)
    ////console.log('ff', format)
    //ipld.addFormat(format)
    //signer = new EllipticSigner(fixtures.keys[0].priv)
    //const aa = await dagJose.signing.create({ test: 123 }, signer)
    ////const formatCode = multiformats.multicodec.get(dagJose.name).code
    //const cid = await ipld.put(aa, format.codec)
    //console.log(cid)
    //const data = await ipld.get(cid)
    //console.log(data)
    //console.log(data.signatures)
  })

  describe('Signing', () => {
    it('Encode string', async () => {
    })

    it('Encode general', async () => {
    })

    it('Encode dagJose', async () => {
    })

    it('Decode Buffer', async () => {
      // test with Uint8Array and Buffer
      //console.log('asdf')
    })

    it('Decode Uint8Array', async () => {
    })

    it('IPLD integration', async () => {
    })
  })

  describe.skip('Encryption', () => {
    it('Encode string', async () => {
    })

    it('Encode general', async () => {
    })

    it('Encode dagJose', async () => {
    })

    it('Decode Buffer', async () => {
      // test with Uint8Array and Buffer
      //console.log('asdf')
    })

    it('Decode Uint8Array', async () => {
    })
  })
})
