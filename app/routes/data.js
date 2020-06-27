const wreck = require('wreck')
const config = require('../config')
const mapAuth = require('../handlers/map-auth')

module.exports = [{
  method: 'GET',
  path: '/data',
  config: {
    pre: [{ method: mapAuth, assign: 'auth' }]
  },
  handler: async (request, h) => {
    const token = request.state.dl_token
    const { payload } = await wreck.get(`${config.apiGatewayHost}/restricted-role`, {
      payload: request.payload,
      headers: {
        Authorization: token || ''
      }
    })
    return h.view('success', { model: payload, auth: request.pre.auth })
  }
}]
