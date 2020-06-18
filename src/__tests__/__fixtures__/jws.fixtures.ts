import CID from 'cids'

const fixtures = {
  keys: [{
    priv: '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
    pub: { publicKeyHex: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479' }
  }, {
    priv: '62387646793457634876534678c5012b5ec63d36ec77e8a2417154cc1d25383f',
    pub: { publicKeyHex: '0276e2ef41a24cdee14c764a44fae0ca3ea3a60c8cc9f3ac930623ac6a5cb3143e' }
  }],
  compact: 'eyJhbGciOiJFUzI1NksifQ.eyJhIjoxLCJiIjoyfQ.Gw9SW3zfIH-WdLqu5KFVSAQcm29EZ2rPfq1gCFnoZslIfvX4ZB2v_piuMvPEVK-i9hBm7EthO7iK1YqxFJ4wbQ',
  generalJws: {
    oneSig: [{
      payload: 'eyJhIjoxLCJiIjoyfQ', // signed by key 0
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'Gw9SW3zfIH-WdLqu5KFVSAQcm29EZ2rPfq1gCFnoZslIfvX4ZB2v_piuMvPEVK-i9hBm7EthO7iK1YqxFJ4wbQ' } ]
    }, {
      payload: 'eyJiIjoyLCJhIjoxfQ', // signed by key 0
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'za9gI0sb85V3XdfQYvbzBIy82OGtzeJ-ipTw0EZOz3Z1pX2Bp3tadvGr50H_wRASdJw5FxR3Y4l9_TOvwJDljw' } ]
    }],
    oneSigWLinks: [{ // signed by key 0
      payload: 'eyJhIjp7Ii8iOnsiYmFzZTY0IjoiRVE9PSJ9fSwiYiI6eyIvIjoiYmFmeWJlaWc2eHY1bndwaGZtdmNuZWt0cG5vanRzMzNqcWN1YW03Ym15ZTJwYjU0YWRucnRjY2psc3UifX0',
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'oGyjzZv4cEmlSI_vJrISoEuoV1QOFEhvvdB8bz_n1G8E4omXGXJp2LRkzxFXjffuQ1QV2WJ0_52Ckh0pYkfqAg' } ]
    }, { // signed by key 1
      payload: 'eyJiIjp7Ii8iOiJiYWZ5YmVpZzZ4djVud3BoZm12Y25la3Rwbm9qdHMzM2pxY3VhbTdibXllMnBiNTRhZG5ydGNjamxzdSJ9LCJhIjp7Ii8iOnsiYmFzZTY0IjoiRVE9PSJ9fX0',
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: '3FnJtvIYtiNzKcxwag8DubWHhpa9tcvGzyjxN8xEvHoqNJBIinDie9k16YUD82DRd8TgObfTv-XfYPsa6PuktA' } ]
    }],
    mutipleSig: {
      payload: 'eyJhIjoxLCJiIjoyfQ',
      signatures: [{
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'Gw9SW3zfIH-WdLqu5KFVSAQcm29EZ2rPfq1gCFnoZslIfvX4ZB2v_piuMvPEVK-i9hBm7EthO7iK1YqxFJ4wbQ'
      }, {
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'yFqj94_8NZ9v8C5uVKyUzVjpfjiZVkaBx1pjXeRhEDs8xw_b6XXhVdPpEtFZibQkLZMAY2SCX6M6zIv6rX4U4Q'
      }]
    },
    mutipleSigWLinks: {
      payload: 'eyJhIjp7Ii8iOnsiYmFzZTY0IjoiRVE9PSJ9fSwiYiI6eyIvIjoiYmFmeWJlaWc2eHY1bndwaGZtdmNuZWt0cG5vanRzMzNqcWN1YW03Ym15ZTJwYjU0YWRucnRjY2psc3UifX0',
      signatures: [{
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'oGyjzZv4cEmlSI_vJrISoEuoV1QOFEhvvdB8bz_n1G8E4omXGXJp2LRkzxFXjffuQ1QV2WJ0_52Ckh0pYkfqAg'
      }, {
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'yrueInT_ruEBvc7pWaCFIJgkKd85Jweka9sPXuw6GX5kqX3a-8yKccfCzEyU-NYEMpKy8Q8THV5TwEJHIMhdGA'
      }]
    }
  },
  dagJws: {
    oneSig: [{
      payload: { a: 1, b: 2 },
      signatures: [{
        signature: Buffer.from('1b0f525b7cdf207f9674baaee4a15548041c9b6f44676acf7ead600859e866c9487ef5f8641daffe98ae32f3c454afa2f61066ec4b613bb88ad58ab1149e306d', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    }, {
      payload: { b: 2, a: 1 },
      signatures: [{
        signature: Buffer.from('cdaf60234b1bf395775dd7d062f6f3048cbcd8e1adcde27e8a94f0d0464ecf7675a57d81a77b5a76f1abe741ffc11012749c3917147763897dfd33afc090e58f', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    }],
    oneSigWLinks: [{
      payload: { a: Buffer.from('11', 'hex'), b: new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu') },
      signatures: [{
        signature: Buffer.from('a06ca3cd9bf87049a5488fef26b212a04ba857540e14486fbdd07c6f3fe7d46f04e28997197269d8b464cf11578df7ee435415d96274ff9d82921d296247ea02', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    }, {
      payload: { b: new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'), a: Buffer.from('11', 'hex') },
      signatures: [{
        signature: Buffer.from('dc59c9b6f218b6237329cc706a0f03b9b5878696bdb5cbc6cf28f137cc44bc7a2a3490488a70e27bd935e98503f360d177c4e039b7d3bfe5df60fb1ae8fba4b4', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    }],
    mutipleSig: {
      payload: { a: 1, b: 2 },
      signatures: [{
        signature: Buffer.from('1b0f525b7cdf207f9674baaee4a15548041c9b6f44676acf7ead600859e866c9487ef5f8641daffe98ae32f3c454afa2f61066ec4b613bb88ad58ab1149e306d', 'hex'),
        protected: { alg: 'ES256K' }
      }, {
        signature: Buffer.from('c85aa3f78ffc359f6ff02e6e54ac94cd58e97e3899564681c75a635de461103b3cc70fdbe975e155d3e912d15989b4242d93006364825fa33acc8bfaad7e14e1', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    },
    mutipleSigWLinks: {
      payload: { a: Buffer.from('11', 'hex'), b: new CID('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu') },
      signatures: [{
        signature: Buffer.from('a06ca3cd9bf87049a5488fef26b212a04ba857540e14486fbdd07c6f3fe7d46f04e28997197269d8b464cf11578df7ee435415d96274ff9d82921d296247ea02', 'hex'),
        protected: { alg: 'ES256K' }
      }, {
        signature: Buffer.from('cabb9e2274ffaee101bdcee959a08520982429df392707a46bdb0f5eec3a197e64a97ddafbcc8a71c7c2cc4c94f8d6043292b2f10f131d5e53c0424720c85d18', 'hex'),
        protected: { alg: 'ES256K' }
      }]
    }
  }
}

export default fixtures
