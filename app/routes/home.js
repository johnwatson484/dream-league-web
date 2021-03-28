const api = require('../api')

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    const results = await api.get('/dream-league/results', request.state.dl_token)
    return h.view('home', { results })
  }
}]
