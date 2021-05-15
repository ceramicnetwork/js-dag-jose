import { bytes } from 'multiformats'

/*eslint-disable */
const fixtures = {
  keys: [
    bytes.fromHex('278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'),
    bytes.fromHex('62387646793457634876534678c5012b5ec63d36ec77e8a2417154cc1d25383f'),
    bytes.fromHex('76e2ef41a24cdee14c764a44fae0ca3ea3a60c8cc9f3ac930623ac6a5cb3143e')
  ],
  compact: 'eyJhbGciOiJkaXIiLCJlbmMiOiJYQzIwUCJ9..iJc770o6qWs15wlZnNrGaYYznIdK0Srv.NCoT_iDnLqtqkWHQRoC_41YfGZy5dGLS6JT3qJoYrznHz5DW.En-zMkJdDo7QQe9rqxjLPA',
  dagJwe: {
    dir: {
      protected: 'eyJhbGciOiJkaXIiLCJlbmMiOiJYQzIwUCJ9',
      iv: 'iJc770o6qWs15wlZnNrGaYYznIdK0Srv',
      ciphertext: 'NCoT_iDnLqtqkWHQRoC_41YfGZy5dGLS6JT3qJoYrznHz5DW',
      tag: 'En-zMkJdDo7QQe9rqxjLPA'
    },
    oneRecip: {
      protected: 'eyJlbmMiOiJYQzIwUCJ9',
      iv: 'UfYAQZqNP3DMruWuxa4UCADbFn0PKPj_',
      ciphertext: 'ShKob46hSumpE0mod63dyHUiG5BixSwXUZEnas7W_Qwfcey2',
      tag: 'lh0dagpT7Sd7b2MppiM3vw',
      recipients: [
        {
          encrypted_key: 'wnxYzH9VEI8Tcg_UaDb-jVNLkfpag3xeY_a1p7AMH2c',
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'WXzvANY_tfso7evHavOf7-bxXUk-xnOP',
            tag: '3qYSH0O7JZKWd5_74Cm-Zg',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'kmaKBtxBlEfGpVRpD0ZMk1bfwN3VgFcYUkPZI9oUDEo'
            }
          }
        }
      ]
    },
    multipleRecip: {
      protected: 'eyJlbmMiOiJYQzIwUCJ9',
      iv: '8_PJJGfBkbKjP3A-3HK_CfZTg5IWBzd0',
      ciphertext: 'bf3EjktGprd7pUQ8mzU4uke8_4KDwN6Z-PHBX65W0JlNqJG9',
      tag: 'gD5LXz4_h1GP4Xdv9S_u-Q',
      recipients: [
        {
          encrypted_key: 'DFzYEgHrY697Lc7MTynzvOZvAPw5ZGCF5cmw1prkFNo',
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'AgLyYatlJnGqXo9FaY5asyNMjiKfMdtZ',
            tag: '6_u25OtpUBWVXzvvPdppSA',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'EprUVZBKzdKWWfdJd7rJg--_8ZhkANe5nzhle0VpAyg'
            }
          }
        },
        {
          encrypted_key: 'mH1JZHXvXnWRU8NV0kk-22pwB7LooYigECb6Zjb3e-A',
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'lrDbW8Elc8S0gT7i_yJRhLNQkWlAQjJ3',
            tag: 'K3K9kY31PQ7GmPb_GAIovQ',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'zBduD4YWph7-OSIp3FgFF2VVAzUD7xhGfy-j2pa4zQA'
            }
          }
        }
      ]
    },
  },
  encodedJwe: {
    dir: {
      protected: bytes.fromHex('7b22616c67223a22646972222c22656e63223a225843323050227d'),
      iv: bytes.fromHex('88973bef4a3aa96b35e709599cdac66986339c874ad12aef'),
      ciphertext: bytes.fromHex('342a13fe20e72eab6a9161d04680bfe3561f199cb97462d2e894f7a89a18af39c7cf90d6'),
      tag: bytes.fromHex('127fb332425d0e8ed041ef6bab18cb3c')
    },
    oneRecip: {
      protected: bytes.fromHex('7b22656e63223a225843323050227d'),
      iv: bytes.fromHex('51f600419a8d3f70ccaee5aec5ae140800db167d0f28f8ff'),
      ciphertext: bytes.fromHex('4a12a86f8ea14ae9a91349a877adddc875221b9062c52c175191276aced6fd0c1f71ecb6'),
      tag: bytes.fromHex('961d1d6a0a53ed277b6f6329a62337bf'),
      recipients: [
        {
          encrypted_key: bytes.fromHex('c27c58cc7f55108f13720fd46836fe8d534b91fa5a837c5e63f6b5a7b00c1f67'),
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'WXzvANY_tfso7evHavOf7-bxXUk-xnOP',
            tag: '3qYSH0O7JZKWd5_74Cm-Zg',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'kmaKBtxBlEfGpVRpD0ZMk1bfwN3VgFcYUkPZI9oUDEo'
            }
          }
        }
      ]
    },
    multipleRecip: {
      protected: bytes.fromHex('7b22656e63223a225843323050227d'),
      iv: bytes.fromHex('f3f3c92467c191b2a33f703edc72bf09f653839216073774'),
      ciphertext: bytes.fromHex('6dfdc48e4b46a6b77ba5443c9b3538ba47bcff8283c0de99f8f1c15fae56d0994da891bd'),
      tag: bytes.fromHex('803e4b5f3e3f87518fe1776ff52feef9'),
      recipients: [
        {
          encrypted_key: bytes.fromHex('0c5cd81201eb63af7b2dcecc4f29f3bce66f00fc39646085e5c9b0d69ae414da'),
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'AgLyYatlJnGqXo9FaY5asyNMjiKfMdtZ',
            tag: '6_u25OtpUBWVXzvvPdppSA',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'EprUVZBKzdKWWfdJd7rJg--_8ZhkANe5nzhle0VpAyg'
            }
          }
        },
        {
          encrypted_key: bytes.fromHex('987d496475ef5e759153c355d2493edb6a7007b2e8a188a01026fa6636f77be0'),
          header: {
            alg: 'ECDH-ES+XC20PKW',
            iv: 'lrDbW8Elc8S0gT7i_yJRhLNQkWlAQjJ3',
            tag: 'K3K9kY31PQ7GmPb_GAIovQ',
            epk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'zBduD4YWph7-OSIp3FgFF2VVAzUD7xhGfy-j2pa4zQA'
            }
          }
        }
      ]
    },
  },
  blockEncoded: {
    dir: bytes.fromHex('a4626976581888973bef4a3aa96b35e709599cdac66986339c874ad12aef6374616750127fb332425d0e8ed041ef6bab18cb3c6970726f746563746564581b7b22616c67223a22646972222c22656e63223a225843323050227d6a636970686572746578745824342a13fe20e72eab6a9161d04680bfe3561f199cb97462d2e894f7a89a18af39c7cf90d6'),
    oneRecip: bytes.fromHex('a5626976581851f600419a8d3f70ccaee5aec5ae140800db167d0f28f8ff6374616750961d1d6a0a53ed277b6f6329a62337bf6970726f7465637465644f7b22656e63223a225843323050227d6a6369706865727465787458244a12a86f8ea14ae9a91349a877adddc875221b9062c52c175191276aced6fd0c1f71ecb66a726563697069656e747381a266686561646572a4626976782057587a76414e595f7466736f3765764861764f66372d627858556b2d786e4f5063616c676f454344482d45532b58433230504b576365706ba36178782b6b6d614b427478426c4566477056527044305a4d6b316266774e335667466359556b505a49396f5544456f6363727666583235353139636b7479634f4b5063746167763371595348304f374a5a4b5764355f3734436d2d5a676d656e637279707465645f6b65795820c27c58cc7f55108f13720fd46836fe8d534b91fa5a837c5e63f6b5a7b00c1f67'),
    multipleRecip: bytes.fromHex('a56269765818f3f3c92467c191b2a33f703edc72bf09f6538392160737746374616750803e4b5f3e3f87518fe1776ff52feef96970726f7465637465644f7b22656e63223a225843323050227d6a6369706865727465787458246dfdc48e4b46a6b77ba5443c9b3538ba47bcff8283c0de99f8f1c15fae56d0994da891bd6a726563697069656e747382a266686561646572a4626976782041674c795961746c4a6e4771586f39466159356173794e4d6a694b664d64745a63616c676f454344482d45532b58433230504b576365706ba36178782b45707255565a424b7a644b575766644a6437724a672d2d5f385a686b414e65356e7a686c653056704179676363727666583235353139636b7479634f4b506374616776365f7532354f747055425756587a76765064707053416d656e637279707465645f6b657958200c5cd81201eb63af7b2dcecc4f29f3bce66f00fc39646085e5c9b0d69ae414daa266686561646572a462697678206c7244625738456c63385330675437695f794a52684c4e516b576c41516a4a3363616c676f454344482d45532b58433230504b576365706ba36178782b7a426475443459577068372d4f5349703346674646325656417a55443778684766792d6a327061347a51416363727666583235353139636b7479634f4b5063746167764b334b396b593331505137476d50625f4741496f76516d656e637279707465645f6b65795820987d496475ef5e759153c355d2493edb6a7007b2e8a188a01026fa6636f77be0')
  },
}
/*eslint-enable */

export default fixtures
