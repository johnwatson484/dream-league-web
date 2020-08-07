const wreck = require('wreck')
const config = require('../config')

async function validate (decoded, request, h) {
  const { payload } = await wreck.post(`${config.apiHost}/validate`, {
    payload: {
      token: decoded
    }
  })
  return JSON.parse(payload.toString())
}

module.exports = {
  validate
}
