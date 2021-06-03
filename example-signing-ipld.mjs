// JWT & utilities
import {
  ES256KSigner,
  createJWS,
  verifyJWS
} from 'did-jwt'
import {
  encodePayload,
  toJWSPayload,
  toJWSStrings
} from 'dag-jose-utils'

import * as Block from 'multiformats/block'
import { sha256 } from 'multiformats/hashes/sha2'
import * as dagCbor from '@ipld/dag-cbor'
import * as dagJose from './lib/index.js'

async function storeSigned (payload, privkey, store) {
  console.log('Signing and storing payload:\u001b[1m', payload, '\u001b[22m')

  const signer = ES256KSigner(privkey)
  // arbitrary data to DAG-CBOR encode, we get a:
  // { cid:CID, linkedBlock: Uint8Array }
  const payloadBlock = await encodePayload(payload)
  // sign the CID as a JWS using our signer
  const jws = await createJWS(toJWSPayload(payloadBlock), signer)

  // createJWS gives us a compact string form JWS, DAG-JOSE will accept both the
  // compact and general (object) form but a round-trip decode will always
  // result in the general form. If we want need `jws` to be isometric regardless
  // of whether it has been round-tripped through DAG-JOSE or straight out of
  // `createJWS()` we can call `toGeneral()` to ensure it is always in the
  // general form.
  // jws = dagJose.toGeneral(jws)

  // encode as a DagJWS IPLD block
  const jwsBlock = await Block.encode({ value: jws, codec: dagJose, hasher: sha256 })

  // we now have two blocks, a signed envelope and a payload
  // DagJWS envelope:
  //  - CID: jwsBlock.cid
  //  - Bytes: jwsBlock.bytes
  // Payload:
  //  - CID: payloadBlock.cid
  //  - Bytes: payloadBlock.linkedBlock

  // store them both in our jwsBlock store:
  store.set(jwsBlock.cid.toString(), jwsBlock.bytes)
  store.set(payloadBlock.cid.toString(), payloadBlock.linkedBlock)
  console.log(`Stored payload as \u001b[32m${payloadBlock.cid}\u001b[39m`)
  console.log(`Stored signed JWS envelope as \u001b[32m${jwsBlock.cid}\u001b[39m`)

  // share the envelope CID
  return jwsBlock.cid
}

async function loadVerified (cid, store, pubkey) {
  // load envelope DagJWS block
  const bytes = store.get(cid.toString())
  // validate cid matches bytes and decode dag-jose JWS
  const jwsBlock = await Block.create({ bytes, cid, codec: dagJose, hasher: sha256 })
  const jwsStrings = toJWSStrings(jwsBlock.value)
  // verify the signatures found in the block against our pubkey
  for (const jws of jwsStrings) {
    const verifiedKey = verifyJWS(jws, [{ publicKeyHex: pubkey }]) // will throw if it doesn't verify
    console.log(`Verified JWS envelope \u001b[32m${cid}\u001b[39m with public key:\n\t${verifiedKey.publicKeyHex}`)
  }

  const payloadCid = jwsBlock.value.link
  const payloadBytes = store.get(payloadCid.toString())
  // validate payloadCid matches bytes and decode dag-cbor payload
  return await Block.create({ bytes: payloadBytes, cid: payloadCid, codec: dagCbor, hasher: sha256 })
}

async function signing () {
  // Signing keypair
  const pubkey = '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479'
  const privkey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'

  // An IPLD block store, this could be IPFS or any other type of CID:Bytes mapping store
  /** @type {Map<string, Uint8Array>} */
  const store = new Map()

  // Store the payload and get the CID of the signed DagJWT envelope
  const cid = await storeSigned({ my: 'payload' }, privkey, store)

  // Retrieve the payload via the signed envelope, verifying the signature is valid along the way
  const payloadBlock = await loadVerified(cid, store, pubkey)
  console.log(`Got verified payload \u001b[32m${payloadBlock.cid}\u001b[39m:\u001b[1m`,
    payloadBlock.value,
    '\u001b[22m')
}

signing().catch((e) => {
  console.error(e.stack)
  process.exit(1)
})
