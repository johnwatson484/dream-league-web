const Joi = require('joi')
const boom = require('@hapi/boom')
const { get, post } = require('../../api')
const { GET, POST } = require('../../constants/verbs')
const { DEFENDER, MIDFIELDER, FORWARD } = require('../../constants/positions')
const positions = [DEFENDER, MIDFIELDER, FORWARD]

module.exports = [{
  method: GET,
  path: '/league/players',
  options: {
    validate: {
      query: {
        search: Joi.string().allow(''),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const players = await get(`/league/players?search=${request.query.search}`, request.state.dl_token)
    return h.view('league/players', { players })
  },
}, {
  method: GET,
  path: '/league/player/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const teams = await get('/league/teams', request.state.dl_token)
    return h.view('league/create-player', { teams, positions })
  },
}, {
  method: POST,
  path: '/league/player/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        firstName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        position: Joi.string().valid(...positions),
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const teams = await get('/league/teams', request.state.dl_token)
        return h.view('league/create-player', { teams, positions, error, player: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/create', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    },
  },
}, {
  method: GET,
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const player = await get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
    const teams = await get('/league/teams', request.state.dl_token)
    return h.view('league/edit-player', { player, teams, positions })
  },
}, {
  method: POST,
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        playerId: Joi.number().integer().required(),
        firstName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        position: Joi.string().valid(...positions),
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const teams = await get('/league/teams', request.state.dl_token)
        return h.view('league/edit-player', { player: request.payload, teams, positions, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/edit', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    },
  },
}, {
  method: GET,
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const player = await get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
    return h.view('league/delete-player', { player })
  },
}, {
  method: POST,
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const player = await get(`/league/player/?playerId=${request.query.playerId}`, request.state.dl_token)
        return h.view('league/delete-player', { player, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/delete', request.payload, request.state.dl_token)
      return h.redirect('/league/players')
    },
  },
}, {
  method: POST,
  path: '/league/players/autocomplete',
  options: {
    plugins: {
      crumb: false,
    },
    validate: {
      payload: {
        prefix: Joi.string(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      const players = await post('/league/players/autocomplete', request.payload, request.state.dl_token)
      return players.map(function (player) {
        return {
          label: `${player.lastNameFirstName} - ${player.team.name} - ${player.position}`,
          val: player.playerId,
        }
      })
    },
  },
}]
