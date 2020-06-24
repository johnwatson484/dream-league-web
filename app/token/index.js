const wreck = require('wreck')
const config = require('../config')

async function validate (decoded, request, h) {
  console.log(decoded)
  const { payload } = await wreck.post(`${config.apiGatewayHost}/validate`, {
    payload: {
      token: decoded
    }
  })
  return JSON.parse(payload.toString())
}

module.exports = {
  validate
}
