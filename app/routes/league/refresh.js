const { refreshPlayers } = require('../../refresh')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/league/refresh',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: (_request, h) => {
    return h.view('league/refresh')
  },
}, {
  method: POST,
  path: '/league/refresh/players',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false,
    },
    handler: async (request, h) => {
      const response = await refreshPlayers(request.payload.playerFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/league/players')
      }
      return h.view('league/refresh', {
        message: 'Some players could not be mapped',
        unmappedPlayers: response.unmappedPlayers,
      })
    },
  },
}]
