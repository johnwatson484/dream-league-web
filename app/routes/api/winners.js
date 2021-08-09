const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/api/v1/winners',
  options: {
    handler: async (request, h) => {
      const winners = await api.get('/dream-league/winners', request.state.dl_token)
      return h.response(winners)
    }
  }
}, {
  method: 'GET',
  path: '/api/data/winners',
  options: {
    handler: async (request, h) => {
      return h.redirect('/api/v1/winners')
    }
  }
}]
