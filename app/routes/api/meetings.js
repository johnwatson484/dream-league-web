const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/api/v1/meetings',
  options: {
    handler: async (request, h) => {
      const meetings = await api.get('/meetings', request.state.dl_token)
      return h.response(meetings)
    }
  }
}, {
  method: 'GET',
  path: '/api/data/meetings',
  options: {
    handler: async (_request, h) => {
      return h.redirect('/api/v1/meetings')
    }
  }
}]
