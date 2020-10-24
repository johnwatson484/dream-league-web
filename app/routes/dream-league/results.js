const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    const players = await api.get('/dream-league/resultsheet', request.state.dl_token)
    console.log(players)
    return h.view('dream-league/results-edit', { players })
  }
}]
