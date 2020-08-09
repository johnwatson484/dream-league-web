const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  handler: async (request, h) => {
    const players = await api.get('/league/players', request.state.dl_token)
    return h.view('league/players', { players })
  }
}]
