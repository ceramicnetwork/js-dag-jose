import { CID, bytes } from 'multiformats'

/*eslint-disable */
export const fixtures = {
  keys: [{
    priv: '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
    pub: { publicKeyHex: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479' }
  }, {
    priv: '62387646793457634876534678c5012b5ec63d36ec77e8a2417154cc1d25383f',
    pub: { publicKeyHex: '0276e2ef41a24cdee14c764a44fae0ca3ea3a60c8cc9f3ac930623ac6a5cb3143e' }
  }],
  compact: 'eyJhbGciOiJFUzI1NksifQ.AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV.SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g',
  general: {
    payload: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
    signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g' } ],
    link: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu')
  },
  dagJws: {
    oneSig: [{
      payload: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV', // signed by key 0
      link: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g' } ]
    }, {
      payload: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV', // signed by key 1
      link: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
      signatures: [ { protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'Q8PdTE5A5N3a0ktO2wNdUymumHlSxNF9Si38IvzsMaSZC63yQw-bJNpKf-UeJFPH7cDzY7jLg2G_viejp7NqXg' } ]
    }],
    multipleSig: {
      payload: 'AXASIN69ets85WVE0ipva5M5b2mAqAZ8LME08PeAG2MxCSuV',
      link: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
      signatures: [{
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'SiYGXW7Yi-KxbpIlLNmu0lEhrayV7ypaAC49GAcQ_qpTstZW89Mz6Cp8VlUEX-qVsgYjc-9-1zvLcDYlxOsr1g'
      }, {
        protected: 'eyJhbGciOiJFUzI1NksifQ', signature: 'Q8PdTE5A5N3a0ktO2wNdUymumHlSxNF9Si38IvzsMaSZC63yQw-bJNpKf-UeJFPH7cDzY7jLg2G_viejp7NqXg'
      }]
    },
    withPayload: {
      payload: 'eyJ0ZXN0IjoicGF5bG9hZCIsImFMaW5rIjoiaXBmczovL2JhZnliZWlnNnh2NW53cGhmbXZjbmVrdHBub2p0czMzanFjdWFtN2JteWUycGI1NGFkbnJ0Y2NqbHN1IiwiYXJyIjpbImlwZnM6Ly9iYWZ5YmVpZzZ4djVud3BoZm12Y25la3Rwbm9qdHMzM2pxY3VhbTdibXllMnBiNTRhZG5ydGNjamxzdSIsIml0ZW0xIiwiaXRlbTIiXSwibmVzdGVkIjp7ImFMaW5rIjoiaXBmczovL2JhZnliZWlnNnh2NW53cGhmbXZjbmVrdHBub2p0czMzanFjdWFtN2JteWUycGI1NGFkbnJ0Y2NqbHN1IiwiYXJyIjpbImlwZnM6Ly9iYWZ5YmVpZzZ4djVud3BoZm12Y25la3Rwbm9qdHMzM2pxY3VhbTdibXllMnBiNTRhZG5ydGNjamxzdSIsIml0ZW0xIiwiaXRlbTIiXX19',
      signatures: [{
        protected: 'eyJhbGciOiJFUzI1NksifQ',
        signature: 'IY8AHhQB0n5QpO1opse83d6HrXWfofPjW6if5vVB7Dky3wj2-daT8I1xHX5s4PbuC3owZo2rr8C-nGQsftHE-w'
      }],
      pld: {
        test: 'payload',
        aLink: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
        arr: [ CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'), 'item1', 'item2' ],
        nested: {
          aLink: CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'),
          arr: [ CID.parse('bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu'), 'item1', 'item2' ],
        }
      }
    },
  },
  encodedJws: {
    oneSig: [{
      payload: bytes.fromHex('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95'),
      signatures: [{
        signature: bytes.fromHex('4a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6'),
        protected: bytes.fromHex('7b22616c67223a2245533235364b227d'),
      }]
    }, {
      payload: bytes.fromHex('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95'),
      signatures: [{
        signature: bytes.fromHex('43c3dd4c4e40e4dddad24b4edb035d5329ae987952c4d17d4a2dfc22fcec31a4990badf2430f9b24da4a7fe51e2453c7edc0f363b8cb8361bfbe27a3a7b36a5e'),
        protected: bytes.fromHex('7b22616c67223a2245533235364b227d'),
      }]
    }],
    multipleSig: {
      payload: bytes.fromHex('01701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b95'),
      signatures: [{
        signature: bytes.fromHex('4a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6'),
        protected: bytes.fromHex('7b22616c67223a2245533235364b227d'),
      }, {
        signature: bytes.fromHex('43c3dd4c4e40e4dddad24b4edb035d5329ae987952c4d17d4a2dfc22fcec31a4990badf2430f9b24da4a7fe51e2453c7edc0f363b8cb8361bfbe27a3a7b36a5e'),
        protected: bytes.fromHex('7b22616c67223a2245533235364b227d'),
      }]
    },
    withPayload: {
      payload: bytes.fromHex('7b2274657374223a227061796c6f6164222c22614c696e6b223a22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c22617272223a5b22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c226974656d31222c226974656d32225d2c226e6573746564223a7b22614c696e6b223a22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c22617272223a5b22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c226974656d31222c226974656d32225d7d7d'),
      signatures: [
        {
          protected: bytes.fromHex('7b22616c67223a2245533235364b227d'),
          signature: bytes.fromHex('218f001e1401d27e50a4ed68a6c7bcddde87ad759fa1f3e35ba89fe6f541ec3932df08f6f9d693f08d711d7e6ce0f6ee0b7a30668dabafc0be9c642c7ed1c4fb')
        }
      ]
    }
  },
  blockEncoded: {
    oneSig: [
      bytes.fromHex('a2677061796c6f6164582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956a7369676e61747572657381a26970726f746563746564507b22616c67223a2245533235364b227d697369676e617475726558404a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6'),
      bytes.fromHex('a2677061796c6f6164582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956a7369676e61747572657381a26970726f746563746564507b22616c67223a2245533235364b227d697369676e6174757265584043c3dd4c4e40e4dddad24b4edb035d5329ae987952c4d17d4a2dfc22fcec31a4990badf2430f9b24da4a7fe51e2453c7edc0f363b8cb8361bfbe27a3a7b36a5e'),
    ],
    multipleSig: bytes.fromHex('a2677061796c6f6164582401701220debd7adb3ce56544d22a6f6b93396f6980a8067c2cc134f0f7801b6331092b956a7369676e61747572657382a26970726f746563746564507b22616c67223a2245533235364b227d697369676e617475726558404a26065d6ed88be2b16e92252cd9aed25121adac95ef2a5a002e3d180710feaa53b2d656f3d333e82a7c5655045fea95b2062373ef7ed73bcb703625c4eb2bd6a26970726f746563746564507b22616c67223a2245533235364b227d697369676e6174757265584043c3dd4c4e40e4dddad24b4edb035d5329ae987952c4d17d4a2dfc22fcec31a4990badf2430f9b24da4a7fe51e2453c7edc0f363b8cb8361bfbe27a3a7b36a5e'),
    withPayload: bytes.fromHex('a2677061796c6f61645901717b2274657374223a227061796c6f6164222c22614c696e6b223a22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c22617272223a5b22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c226974656d31222c226974656d32225d2c226e6573746564223a7b22614c696e6b223a22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c22617272223a5b22697066733a2f2f6261667962656967367876356e777068666d76636e656b74706e6f6a747333336a716375616d37626d7965327062353461646e727463636a6c7375222c226974656d31222c226974656d32225d7d7d6a7369676e61747572657381a26970726f746563746564507b22616c67223a2245533235364b227d697369676e61747572655840218f001e1401d27e50a4ed68a6c7bcddde87ad759fa1f3e35ba89fe6f541ec3932df08f6f9d693f08d711d7e6ce0f6ee0b7a30668dabafc0be9c642c7ed1c4fb'),
  },
  cids: {
    oneSig: [
      'bagcqcerauben4l6ee2wjf2fnkj7vaels4p7lnytenk35j3gl2lzcbtbgyoea',
      'bagcqceravvw4bx7jgkxxjwfuqo2yoja6w4cmvmu3gkew3s7yu3vt2ce7riwa'
    ],
    multipleSig: 'bagcqcera542h3xc57nudkgjcceexyzyxrkwi4ikbn773ag6dqdcyjt6z6rga',
    withPayload: 'bagcqceras6vcqjafsrhwfsgxmzd6g5c2vm3mfolbbubg5rfuhhnobay4m2vq',
  }
}
/*eslint-enable */