/* eslint-env jest */

import * as dagJose from '../src/index.js'
import { fixtures as sFixtures } from './__fixtures__/signing.fixtures'
import { fixtures as eFixtures } from './__fixtures__/encryption.fixtures'

import * as Block from 'multiformats/block'
import { sha256 as hasher } from 'multiformats/hashes/sha2'

async function encodeBlock(value) {
  return Block.encode({ value, hasher, codec: dagJose })
}

async function decodeBlock(bytes) {
  return Block.decode({ bytes, hasher, codec: dagJose })
}

describe('dag-jose codec', () => {
  describe('DagJWS', () => {
    it('Encode compact jws', async () => {
      const block = await encodeBlock(sFixtures.compact)
      expect(block.bytes).toEqual(sFixtures.blockEncoded.oneSig[0])
      expect(block.cid.toString()).toEqual(sFixtures.cids.oneSig[0])
    })

    it('Encode general jws', async () => {
      let block = await encodeBlock(sFixtures.dagJws.oneSig[0])
      expect(block.bytes).toEqual(sFixtures.blockEncoded.oneSig[0])
      expect(block.cid.toString()).toEqual(sFixtures.cids.oneSig[0])

      block = await encodeBlock(sFixtures.dagJws.oneSig[1])
      expect(block.bytes).toEqual(sFixtures.blockEncoded.oneSig[1])
      expect(block.cid.toString()).toEqual(sFixtures.cids.oneSig[1])

      block = await encodeBlock(sFixtures.dagJws.multipleSig)
      expect(block.bytes).toEqual(sFixtures.blockEncoded.multipleSig)
      expect(block.cid.toString()).toEqual(sFixtures.cids.multipleSig)

      block = await encodeBlock(sFixtures.dagJws.withPayload)
      expect(block.bytes).toEqual(sFixtures.blockEncoded.withPayload)
      expect(block.cid.toString()).toEqual(sFixtures.cids.withPayload)
    })

    it('Decode bytes', async () => {
      let block = await decodeBlock(sFixtures.blockEncoded.oneSig[0])
      expect(block.value).toEqual(sFixtures.dagJws.oneSig[0])
      expect(block.cid.toString()).toEqual(sFixtures.cids.oneSig[0])

      block = await decodeBlock(sFixtures.blockEncoded.multipleSig)
      expect(block.value).toEqual(sFixtures.dagJws.multipleSig)
      expect(block.cid.toString()).toEqual(sFixtures.cids.multipleSig)

      block = await decodeBlock(sFixtures.blockEncoded.withPayload)
      expect(block.value).toEqual(sFixtures.dagJws.withPayload)
      expect(block.cid.toString()).toEqual(sFixtures.cids.withPayload)
    })
  })

  describe('DagJWE', () => {
    it('Encode compact jwe', async () => {
      const block = await encodeBlock(eFixtures.compact)
      expect(block.bytes).toEqual(eFixtures.blockEncoded.dir)
      expect(block.cid.toString()).toEqual(eFixtures.cids.dir)
    })

    it('Encode general jwe', async () => {
      let block = await encodeBlock(eFixtures.dagJwe.dir)
      expect(block.bytes).toEqual(eFixtures.blockEncoded.dir)
      expect(block.cid.toString()).toEqual(eFixtures.cids.dir)

      block = await encodeBlock(eFixtures.dagJwe.oneRecip)
      expect(block.bytes).toEqual(eFixtures.blockEncoded.oneRecip)
      expect(block.cid.toString()).toEqual(eFixtures.cids.oneRecip)

      block = await encodeBlock(eFixtures.dagJwe.multipleRecip)
      expect(block.bytes).toEqual(eFixtures.blockEncoded.multipleRecip)
      expect(block.cid.toString()).toEqual(eFixtures.cids.multipleRecip)
    })

    it('Decode bytes', async () => {
      let block = await decodeBlock(eFixtures.blockEncoded.dir)
      expect(block.value).toEqual(eFixtures.dagJwe.dir)
      expect(block.cid.toString()).toEqual(eFixtures.cids.dir)

      block = await decodeBlock(eFixtures.blockEncoded.oneRecip)
      expect(block.value).toEqual(eFixtures.dagJwe.oneRecip)
      expect(block.cid.toString()).toEqual(eFixtures.cids.oneRecip)

      block = await decodeBlock(eFixtures.blockEncoded.multipleRecip)
      expect(block.value).toEqual(eFixtures.dagJwe.multipleRecip)
      expect(block.cid.toString()).toEqual(eFixtures.cids.multipleRecip)
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
