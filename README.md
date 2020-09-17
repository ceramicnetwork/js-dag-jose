# dag-jose
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose?ref=badge_shield)


This library provides a typescript implementation of the dag-jose codec for ipld.

It supports the new [multiformats](https://github.com/multiformats/js-multiformats) library in order to be compatible with both the current and future js-ipfs implementations.

In addition to support for encoding and decoding dag-jose ipld format, this library also provides utility functions for creating and verifying JWS and in the future encrypting and decrypting JWE.


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

```js
// sign object
const payload = new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')
const privkey = // hex private key
signer = new EllipticSigner(privkey)

// put in dag
const dagJws = await dagJose.signing.create(payload, signer)
const cid = await ipfs.dag.put(dagJws, { format: format.codec, hashAlg: 'sha2-256' })

// retreive object
const obj = await ipfs.dat.get(cid)
```

### JWE
```js
import {
  xc20pDirEncrypter,
  xc20pDirDecrypter,
  x25519Encrypter,
  x25519Decrypter,
} from 'did-jwt'
import { generateKeyPairFromSeed } from '@stablelib/x25519'

const cleartext = new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')
```

Symmetric encryption:
```js
const key = // 32 byte Uint8Array

const dirEncrypter = xc20pDirEncrypter(key)
const dirDecrypter = xc20pDirDecrypter(key)

// encrypt and put into ipfs
const dagJwe = await dagJose.createDagJWE(cleartext, dirEncrypter)
const cid = await ipfs.dag.put(dagJwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = await dagJose.decryptDagJWE(retrived, [dirDecrypter])
```

Asymmetric encryption:
```js
const secretKey = // 32 byte Uint8Array

const asymEncrypter = x25519Encrypter(generateKeyPairFromSeed(secretKey))
const asymDecrypter = x25519Decrypter(secretKey)

// encrypt and put into ipfs
const dagJwe = await dagJose.createDagJWE(cleartext, asymEncrypter)
const cid = await ipfs.dag.put(dagJwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = await dagJose.decryptDagJWE(retrived, [asymDecrypter])
```

#### Encrypt and decrypt using external library
The underlaying `did-jwt` library that this package uses only supports `x25519` key exchange and `XChacha20Poly1305`. If you want to use the `dag-jose` codec with other algorithms you can encrypt using an external library and put the resulting JWE into the dag. Below is an example using the [jose](https://github.com/panva/jose/) library.

```js
const jwk = jose.JWK.generateSync('oct', 256)
const cleartext = Buffer.from((new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')).bytes)

// encrypt and put into ipfs
const jwe = jose.JWE.encrypt.flattened(cleartext, jwk, { alg: 'dir', enc: 'A128CBC-HS256' })
const cid = await ipfs.dag.put(dagJwe, { format: format.codec, hashAlg: 'sha2-256' })

// retreive and decrypt object
const retrived = await ipfs.dag.get(cid)
const decryptedData = jose.JWE.decrypt(retrived, jwk)
```

## Maintainer
[Joel Thorstensson](https://github.com/oed)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fceramicnetwork%2Fjs-dag-jose?ref=badge_large)
