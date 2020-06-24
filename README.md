# dag-jose

This library provides a typescript implementation of the dag-jose codec for ipld.

It supports the new [multiformats](https://github.com/multiformats/js-multiformats) library in order to be compatible with both the current and future js-ipfs implementations.

In addition to support for encoding and decoding dag-jose ipld format, this library also provides utility functions for creating and verifying JWS and in the future encrypting and decrypting JWE.


## Usage
```js
import dagJose from 'dag-jose'
import multiformats from 'multiformats/basics.js'
import legacy from 'multiformats/legacy.js'
import Ipfs from 'ipfs'

// setup
multiformats.multicodec.add(dagJose)
const format = legacy(multiformats, dagJose.name)
const ipfs = await Ipfs.create({ ipld: { formats: [format] } })

// sign object
const payload = {
  such: 'data',
  very: new CID('bagcqcera73rupyla6bauseyk75rslfys3st25spm75ykhvgusqvv2zfqtucq')
}
const privkey = // hex private key
signer = new EllipticSigner(privkey)

// put in dag
const dagJws = await dagJose.signing.create(payload, signer)
const cid = await ipfs.dag.put(dagJws, { format: format.codec, hashAlg: 'sha2-256' })

// retreive object
const obj = await ipfs.dat.get(cid)
```

## Maintainer
[Joel Thorstensson](https://github.com/oed)
