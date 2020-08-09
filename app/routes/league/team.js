const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/league/teams',
  handler: async (request, h) => {
    const teams = await api.get('/league/teams', request.state.dl_token)
    return h.view('league/teams', { teams })
  }
}]
