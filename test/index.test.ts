/* eslint-env jest */

import * as dagJose from '../src/index'
import { createDagJWS } from './signing.test'
import sFixtures from './__fixtures__/signing.fixtures'
import eFixtures from './__fixtures__/encryption.fixtures'
import { convert as toLegacyIpld } from 'blockcodec-to-ipld-format'
import IPLD from 'ipld'
import ipldInMem from 'ipld-in-memory'
import { CID } from 'multiformats/cid'
import { ES256KSigner } from 'did-jwt'

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

    it('Decode bytes', () => {
      let decoded
      decoded = dagJose.decode(sFixtures.blockEncoded.oneSig[0])
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[0])

      decoded = dagJose.decode(sFixtures.blockEncoded.multipleSig)
      expect(decoded).toEqual(sFixtures.dagJws.multipleSig)
    })

    it.skip('IPLD integration', async () => {
      const ipld = await ipldInMem(IPLD)
      const format = toLegacyIpld(dagJose)
      ipld.addFormat(format)
      const signer = ES256KSigner(sFixtures.keys[0].priv)
      const cidPayload = CID.parse('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')
      const dagJws = await createDagJWS(cidPayload, signer)
      const cid = await ipld.put(dagJws, format.codec)
      expect(cid.toString()).toEqual('bagcqcera5p4hvkei322lg3hp3dvrmndlojwcst3gvq2nhledmv4plt2ore2q')
      const data = await ipld.get(cid)
      expect(data).toEqual(sFixtures.dagJws.oneSig[0])
    })
  })

  describe('DagJWE', () => {
    it('Encode compact jwe', () => {
      const encoded = dagJose.encode(eFixtures.compact)
      expect(encoded).toEqual(eFixtures.blockEncoded.dir)
    })

    it('Encode general jwe', () => {
      let encoded = dagJose.encode(eFixtures.dagJwe.dir)
      expect(encoded).toEqual(eFixtures.blockEncoded.dir)

      encoded = dagJose.encode(eFixtures.dagJwe.oneRecip)
      expect(encoded).toEqual(eFixtures.blockEncoded.oneRecip)

      encoded = dagJose.encode(eFixtures.dagJwe.multipleRecip)
      expect(encoded).toEqual(eFixtures.blockEncoded.multipleRecip)
    })

    it('Decode bytes', () => {
      let decoded
      decoded = dagJose.decode(eFixtures.blockEncoded.dir)
      expect(decoded).toEqual(eFixtures.dagJwe.dir)

      decoded = dagJose.decode(eFixtures.blockEncoded.oneRecip)
      expect(decoded).toEqual(eFixtures.dagJwe.oneRecip)

      decoded = dagJose.decode(eFixtures.blockEncoded.multipleRecip)
      expect(decoded).toEqual(eFixtures.dagJwe.multipleRecip)
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
