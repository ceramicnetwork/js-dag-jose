# dag-jose
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose?ref=badge_shield)


This library provides a typescript implementation of the dag-jose codec for ipld.

It supports the new [multiformats](https://github.com/multiformats/js-multiformats) library in order to be compatible with both the current and future js-ipfs implementations.

To create dag-jose compatible jose objects we recommend using the [dag-jose-utils](https://github.com/ceramicnetwork/js-dag-jose-utils) library.

## Usage
First setup the codec:
```js
import dagJose from 'dag-jose'
import multiformats from 'multiformats/basics.js'
import legacy from 'multiformats/legacy.js'
import Ipfs from 'ipfs'

multiformats.multicodec.add(dagJose)
const format = legacy(multiformats, dagJose.name)
const ipfs = await Ipfs.create({ ipld: { formats: [format] } })
```

### JWS
Import additional libraries for JWS creation
```js
import {
  encodePayload,
} from 'dag-jose-utils'
import {
  EllipticSigner,
  createJWS,
} from 'did-jwt'
import * as u8a from 'uint8arrays'
```

```js
// prepare signer
const privkey = // hex private key
signer = new EllipticSigner(privkey)

// encode and sign payload
const payload = await encodePayload({ my: 'payload' })
const jws = createJWS(u8a.toString(payload.cid.bytes), 'base64url', signer)

// put jws in dag
const cid = await ipfs.dag.put(jws, { format: format.codec, hashAlg: 'sha2-256' })

// put the payload data into the ipfs dag
const block = await ipfs.block.put(payload.linkedBlock, { cid: payload.cid })

// get the value of the payload using the payload cid
console.log((await ipfs.dag.get(jwsCid, { path: '/link' })).value)
// output:
// > { some: 'data' }

// retreive JWS
const obj = await ipfs.dat.get(cid)
```

### JWE
```js
import {
  prepareCleartext,
  decodeCleartext
} from 'dag-jose-utils'
import {
  xc20pDirEncrypter,
  xc20pDirDecrypter,
  x25519Encrypter,
  x25519Decrypter,
  createJWE
} from 'did-jwt'
import { generateKeyPairFromSeed } from '@stablelib/x25519'
```

Symmetric encryption:
```js
const key = // 32 byte Uint8Array

const dirEncrypter = xc20pDirEncrypter(key)
const dirDecrypter = xc20pDirDecrypter(key)

// prepare cleartext
const cleartext = prepareCleartext({ my: 'secret message' })

// encrypt and put into ipfs
const jwe = await createJWE(cleartext, [dirEncrypter])
const cid = await ipfs.dag.put(jwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = await decryptJWE(retrived, dirDecrypter)
console.log(decodeCleartext(decryptedData))
// output:
// { my: 'secret message' }
```

Asymmetric encryption:
```js
const secretKey = // 32 byte Uint8Array

const asymEncrypter = x25519Encrypter(generateKeyPairFromSeed(secretKey))
const asymDecrypter = x25519Decrypter(secretKey)

// encrypt and put into ipfs
const jwe = await createJWE(cleartext, [asymEncrypter])
const cid = await ipfs.dag.put(jwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = await decryptJWE(retrived, asymDecrypter)
console.log(decodeCleartext(decryptedData))
// output:
// { my: 'secret message' }
```

#### Encrypt and decrypt using other jose library
The `did-jwt` library only supports `x25519` key exchange and `XChacha20Poly1305`. If you want to use the `dag-jose` codec with other algorithms you can encrypt another library and put the resulting JWE into the dag. Below is an example using the [jose](https://github.com/panva/jose/) library.

```js
const jwk = jose.JWK.generateSync('oct', 256)
const cleartext = prepareCleartext({ my: 'secret message' })

// encrypt and put into ipfs
const jwe = jose.JWE.encrypt.flattened(cleartext, jwk, { alg: 'dir', enc: 'A128CBC-HS256' })
const cid = await ipfs.dag.put(jwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = jose.JWE.decrypt(retrived, jwk)
console.log(decodeCleartext(decryptedData))
// output:
// { my: 'secret message' }
```

## Maintainer
[Joel Thorstensson](https://github.com/oed)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose?ref=badge_large)
