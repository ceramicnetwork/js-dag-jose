import CID from 'cids'
import { SimpleSigner } from 'did-jwt'
import * as codec from '../index'

const FAKE_CID_1 = new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu')
const FAKE_CID_2 = new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsv')

const privkey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'
const pubkey: PublicKey = { publicKeyHex: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479' }
const pubkeyFake: PublicKey = { publicKeyHex: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5350000' }

describe('dag-jose codec', () => {
  let signer

  beforeAll(() => {
    signer = new SimpleSigner(privkey)
  })

  describe('codec interface', () => {
    it('correct interface', async () => {
      expect(codec.name).toEqual('dag-jose')
      expect(codec.code).toEqual(133)
      expect(codec.encode).toBeDefined()
      expect(codec.decode).toBeDefined()
    })

    it('creates JWS JOSENode correctly', async () => {
      const data = { test: 'asdf', link: FAKE_CID_1, nested: { data: FAKE_CID_2 } }
      const node = await codec.createJOSENode(data, { sign: signer })
      expect(node._dagJOSEProtected).toEqual({ alg: 'ES256K' })
      const expectedResult = Object.assign({ _dagJOSEProtected: node._dagJOSEProtected, _dagJOSESignature: node._dagJOSESignature }, data)
      expect(node).toEqual(expectedResult)
    })

    it('verifies JWS JOSENode correctly', async () => {
      const data = { test: 'asdf', link: FAKE_CID_1, nested: { data: FAKE_CID_2 } }
      const node = await codec.createJOSENode(data, { sign: signer })

      expect(() => codec.verifyJOSENode(node, pubkeyFake)).toThrowError('Signature invalid for JWT')
      expect(codec.verifyJOSENode(node, pubkey)).toEqual(pubkey)
    })

    it('encoded and decodes correctly', async () => {
      const data = { test: 'asdf', link: FAKE_CID_1, nested: { data: FAKE_CID_2 } }
      const node = await codec.createJOSENode(data, { sign: signer })

      const encoded = codec.encode(node)
      const decoded = codec.decode(encoded)
      expect(decoded).toEqual(node)
    })
  })
})
