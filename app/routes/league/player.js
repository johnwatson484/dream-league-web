const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  handler: async (request, h) => {
    const players = await api.get('/league/players', request.state.dl_token)
    return h.view('league/players', { players })
  }
}, {
  method: 'POST',
  path: '/league/players/autocomplete',
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
      const players = await api.post('/league/players/autocomplete', request.payload, request.state.dl_token)
      return players.map(function (player) {
        return {
          label: `${player.lastNameFirstName} - ${player.team.name}`,
          val: player.playerId
        }
      })
    }
  }
}]
