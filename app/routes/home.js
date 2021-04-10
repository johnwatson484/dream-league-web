const api = require('../api')

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    const results = await api.get('/dream-league/results', request.state.dl_token)
    const topScorers = await api.get('/dream-league/statistics/top-scorers', request.state.dl_token)
    const form = await api.get('/dream-league/statistics/form', request.state.dl_token)

    console.log(topScorers)
    return h.view('home', { results, topScorers, form })
  }
}]
