import CID from 'cids'
import isCircular from 'is-circular'
import transform from 'lodash.transform'

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function encodeDagJson (obj: Object): Object {
  if (isCircular(obj)) {
    throw new Error('Object contains circular references.')
  }
  return transform(obj, (result, value, key) => {
    if (CID.isCID(value)) {
      result[key] = { '/': value.toString() }
    } else if (Buffer.isBuffer(value)) {
      result[key] = { '/': { base64: value.toString('base64') } }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = encodeDagJson(value)
    } else {
      result[key] = value
    }
  })
}

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function decodeDagJson (obj: Object): Object {
  return transform(obj, (result, value: any, key) => {
    if (typeof value === 'object' && value !== null) {
      if (value['/']) {
        if (typeof value['/'] === 'string') result[key] = new CID(value['/'])
        else if (typeof value['/'] === 'object' && value['/'].base64) {
          result[key] = Buffer.from(value['/'].base64, 'base64')
        } else result[key] = decodeDagJson(value)
      } else {
        result[key] = decodeDagJson(value)
      }
    } else {
      result[key] = value
    }
  })
}

export { encodeDagJson, decodeDagJson }
