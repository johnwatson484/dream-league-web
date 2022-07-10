const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')
const positions = ['Defender', 'Midfielder', 'Forward']

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
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const teams = await api.get('/league/teams', request.state.dl_token)
    return h.view('league/create-player', { teams, positions })
  }
}, {
  method: 'POST',
  path: '/league/player/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        firstName: joi.string().allow(''),
        lastName: joi.string().required(),
        position: joi.string().valid(...positions),
        teamId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const teams = await api.get('/league/teams', request.state.dl_token)
        return h.view('league/create-player', { teams, positions, error, player: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/player/create', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    }
  }
}, {
  method: 'GET',
  path: '/league/player/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const player = await api.get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
    const teams = await api.get('/league/teams', request.state.dl_token)
    return h.view('league/edit-player', { player, teams, positions })
  }
}, {
  method: 'POST',
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        playerId: joi.number().required(),
        firstName: joi.string().allow(''),
        lastName: joi.string().required(),
        position: joi.string().valid(...positions),
        teamId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const teams = await api.get('/league/teams', request.state.dl_token)
        return h.view('league/edit-player', { player: request.payload, teams, positions, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/player/edit', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    }
  }
}, {
  method: 'GET',
  path: '/league/player/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const player = await api.get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
    return h.view('league/delete-player', { player })
  }
}, {
  method: 'POST',
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        playerId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const player = await api.get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
        return h.view('league/delete-player', { player, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/player/delete', request.payload, request.state.dl_token)
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
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, _h) => {
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
