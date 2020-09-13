const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/league/teams',
  handler: async (request, h) => {
    const teams = await api.get('/league/teams', request.state.dl_token)
    return h.view('league/teams', { teams })
  }
}, {
  method: 'POST',
  path: '/league/teams/autocomplete',
  options: {
    plugins: {
      crumb: false
    },
    validate: {
      payload: joi.object({
        prefix: joi.string()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const teams = await api.post('/league/teams/autocomplete', request.payload, request.state.dl_token)
      return teams.map(function (team) {
        return {
          label: team.name,
          val: team.teamId
        }
      })
    }
  }
}]
