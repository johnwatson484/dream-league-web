const { GET } = require('../constants/verbs')
const { get } = require('../api')
const util = require('util')

module.exports = [{
  method: GET,
  path: '/live-scores',
  options: {
    handler: async (request, h) => {
      const matches = await get('/live-scores', request.state.dl_token)
      console.log(util.inspect(matches, false, null, true))
      return h.view('live-scores', { matches })
    }
  }
}]
