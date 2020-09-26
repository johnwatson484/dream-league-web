const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/league/players',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const players = await api.get(`/league/players?search=${request.query.search}`, request.state.dl_token)
      return h.view('league/players', { players })
    }
  }
}, {
  method: 'GET',
  path: '/league/player/create',
  handler: async (request, h) => {
    const teams = await api.get('/league/teams', request.state.dl_token)
    const positions = ['Defender', 'Midfielder', 'Forward']
    return h.view('league/create-player', { teams, positions })
  }
}, {
  method: 'POST',
  path: '/league/player/create',
  options: {
    validate: {
      payload: joi.object({
        firstName: joi.string().allow(''),
        lastName: joi.string(),
        position: joi.string().valid(...['Defender', 'Midfielder', 'Forward']),
        teamId: joi.number()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await api.post('/league/player/create', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    }
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
          label: `${player.lastNameFirstName} - ${player.team.name} - ${player.position}`,
          val: player.playerId
        }
      })
    }
  }
}]
