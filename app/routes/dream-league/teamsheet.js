const refreshTeamSheet = require('../../dream-league/teamsheet-refresh')

module.exports = [{
  method: 'GET',
  path: '/teamsheet',
  handler: (request, h) => {
    return h.view('dream-league/teamsheet')
  }
}, {
  method: 'POST',
  path: '/teamsheet/refresh',
  options: {
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false
    },
    handler: async (request, h) => {
      const response = await refreshTeamSheet(request.payload.teamFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/teamsheet')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped'
      })
    }
  }
}]
