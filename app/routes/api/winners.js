const { get } = require('../../api')
const { GET } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/api/v1/winners',
  options: {
    handler: async (request, h) => {
      const winners = await get('/winners', request.state.dl_token)
      return h.response(winners)
    }
  }
}, {
  method: GET,
  path: '/api/data/winners',
  options: {
    handler: async (_request, h) => {
      return h.redirect('/api/v1/winners')
    }
  }
}]
