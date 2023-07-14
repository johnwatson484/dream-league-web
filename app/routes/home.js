const { get } = require('../api')

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    const results = await get('/results', request.state.dl_token)
    const topScorers = await get('/statistics/top-scorers', request.state.dl_token)
    const form = await get('/statistics/form', request.state.dl_token)
    const nextMeeting = await get('/meetings/next', request.state.dl_token)

    return h.view('home', { results, topScorers, form, nextMeeting })
  }
}, {
  method: 'GET',
  path: '/rules',
  config: {
  },
  handler: async (_request, h) => {
    return h.view('rules')
  }
}]
