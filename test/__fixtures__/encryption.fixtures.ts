//import CID from 'cids'

/*eslint-disable */
const fixtures = {
  keys: [{
    //priv: '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
    //pub: { publicKeyHex: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479' }
  }, {
    //priv: '62387646793457634876534678c5012b5ec63d36ec77e8a2417154cc1d25383f',
    //pub: { publicKeyHex: '0276e2ef41a24cdee14c764a44fae0ca3ea3a60c8cc9f3ac930623ac6a5cb3143e' }
  }],
  // TODO - use real JWEs for the fixtures
  compact: 'eyJhbGciOiJFUzI1NksifQ.AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV.AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV.SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g.AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
  general: {
    ciphertext: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g',
    iv: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
    tag: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
    protected: 'eyJhbGciOiJFUzI1NksifQ',
    recipients: [ { encrypted_key: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV' } ]
  },
  dagJwe: {
    oneRecip: [{
      ciphertext: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g',
      iv: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      tag: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      protected: 'eyJhbGciOiJFUzI1NksifQ',
      recipients: [ { encrypted_key: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV' } ]
    }, {
      ciphertext: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g',
      iv: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      tag: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      protected: 'eyJhbGciOiJFUzI1NksifQ',
      recipients: [ { encrypted_key: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV' } ]
    }],
    multipleRecip: {
      ciphertext: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g',
      iv: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      tag: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      protected: 'eyJhbGciOiJFUzI1NksifQ',
      recipients: [{
        encrypted_key: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV'
      }, {
        encrypted_key: 'BBEERRAAets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV'
      }]
    },
  },
  encodedJwe: {
    oneRecip: [{
      ciphertext: Buffer.from('4a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6', 'hex'),
      iv: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      tag: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      protected: Buffer.from('7b22616c67223a2245533235364b227d', 'hex'),
      recipients: [ { encrypted_key: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex') } ],
    }, {
      ciphertext: Buffer.from('4a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6', 'hex'),
      iv: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      tag: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      protected: Buffer.from('7b22616c67223a2245533235364b227d', 'hex'),
      recipients: [ { encrypted_key: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex') } ],
    }],
    multipleRecip: {
      ciphertext: Buffer.from('4a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6', 'hex'),
      iv: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      tag: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      protected: Buffer.from('7b22616c67223a2245533235364b227d', 'hex'),
      recipients: [{
        encrypted_key: Buffer.from('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex')
      }, {
        encrypted_key: Buffer.from('0411044510007adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex')
      }],
    },
  },
  blockEncoded: {
    oneRecip: [
      Buffer.from('a5626976582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b9563746167582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956970726f746563746564507b22616c67223a2245533235364b227d6a6369706865727465787458404a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd66a726563697069656e747381a16d656e637279707465645f6b6579582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
      Buffer.from('a5626976582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b9563746167582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956970726f746563746564507b22616c67223a2245533235364b227d6a6369706865727465787458404a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd66a726563697069656e747381a16d656e637279707465645f6b6579582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
    ],
    multipleRecip: Buffer.from('a5626976582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b9563746167582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956970726f746563746564507b22616c67223a2245533235364b227d6a6369706865727465787458404a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd66a726563697069656e747382a16d656e637279707465645f6b6579582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95a16d656e637279707465645f6b657958240411044510007adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95', 'hex'),
  },
}
/*eslint-enable */

export default fixtures
