const api = require('../api')

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    const results = await api.get('/results', request.state.dl_token)
    const topScorers = await api.get('/statistics/top-scorers', request.state.dl_token)
    const form = await api.get('/statistics/form', request.state.dl_token)
    const nextMeeting = await api.get('/meetings/next', request.state.dl_token)

    return h.view('home', { results, topScorers, form, nextMeeting })
  }
}, {
  method: 'GET',
  path: '/rules',
  config: {
  },
  handler: async (request, h) => {
    return h.view('rules')
  }
}]
