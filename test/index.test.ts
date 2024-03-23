/* eslint-env jest */

import * as dagJose from '../src/index.js'
import { fixtures as sFixtures } from './__fixtures__/signing.fixtures'
import { fixtures as eFixtures } from './__fixtures__/encryption.fixtures'

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

      encoded = dagJose.encode(sFixtures.dagJws.withPayload)
      expect(encoded).toEqual(sFixtures.blockEncoded.withPayload)
    })

    it('Decode bytes', () => {
      let decoded
      decoded = dagJose.decode(sFixtures.blockEncoded.oneSig[0])
      expect(decoded).toEqual(sFixtures.dagJws.oneSig[0])

      decoded = dagJose.decode(sFixtures.blockEncoded.multipleSig)
      expect(decoded).toEqual(sFixtures.dagJws.multipleSig)

      decoded = dagJose.decode(sFixtures.blockEncoded.withPayload)
      expect(decoded).toEqual(sFixtures.dagJws.withPayload)
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
