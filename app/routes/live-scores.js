const { GET } = require('../constants/verbs')
const { get } = require('../api')

module.exports = [{
  method: GET,
  path: '/live-scores',
  options: {
    handler: async (request, h) => {
      const matches = await get('/live-scores', request.state.dl_token)
      return h.view('live-scores', matches)
    }
  }
}]
