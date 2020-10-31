const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    const players = await api.get('/dream-league/results-edit', request.state.dl_token)
    console.log(players.keepers)
    return h.view('dream-league/results-edit', { players })
  }
}]
