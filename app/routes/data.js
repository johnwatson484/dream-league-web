const wreck = require('wreck')
const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/data',
  handler: async (request, h) => {
    const token = request.state.dl_token
    const { payload } = await wreck.get(`${config.apiGatewayHost}/restricted-role`, {
      payload: request.payload,
      headers: {
        Authorization: token || ''
      }
    })
    return h.view('success', { model: payload })
  }
}]
