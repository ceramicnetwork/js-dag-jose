import CID from 'cids'
import transform from 'lodash.transform'

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function encodeDagJson(obj: Record<string, any>): Record<string, any> {
  return transform(obj, (result, value, key) => {
    if (CID.isCID(value)) {
      result[key] = { '/': value.toString() }
    } else if (Buffer.isBuffer(value)) {
      result[key] = { '/': { base64: value.toString('base64') } }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = encodeDagJson(value)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result[key] = value
    }
  })
}

// copied from https://github.com/ipld/js-dag-json/blob/master/index.js
function decodeDagJson(obj: Record<string, any>): Record<string, any> {
  return transform(obj, (result, value: any, key) => {
    if (typeof value === 'object' && value !== null) {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      if (value['/']) {
        if (typeof value['/'] === 'string') result[key] = new CID(value['/'])
        else if (typeof value['/'] === 'object' && value['/'].base64) {
          result[key] = Buffer.from(value['/'].base64, 'base64')
        } else result[key] = decodeDagJson(value)
      } else {
        result[key] = decodeDagJson(value)
      }
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result[key] = value
    }
  })
}

export { encodeDagJson, decodeDagJson }
