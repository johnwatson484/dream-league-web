const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    const players = await api.get('/dream-league/results-edit', request.state.dl_token)
    players.keepers = players.keepers.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) })
    players.players = players.players.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) || sortFn(a.lastName, b.lastName) || sortFn(a.firstName, b.firstName) })
    return h.view('dream-league/results-edit', { players })
  }
}, {
  method: 'POST',
  path: '/results/edit',
  handler: async (request, h) => {
    await api.post('/dream-league/results-edit', request.payload, request.state.dl_token)
    return h.redirect('/results/edit')
  }
}]

function sortFn (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}
