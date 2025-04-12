const Joi = require('joi')
const boom = require('@hapi/boom')
const { get, post } = require('../../api')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/league/teams',
  handler: async (request, h) => {
    const teams = await get('/league/teams', request.state.dl_token)
    return h.view('league/teams', { teams })
  },
}, {
  method: GET,
  path: '/league/team/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const divisions = await get('/league/divisions', request.state.dl_token)
    return h.view('league/create-team', { divisions })
  },
}, {
  method: POST,
  path: '/league/team/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        name: Joi.string().required(),
        alias: Joi.string().required(),
        divisionId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const divisions = await get('/league/divisions', request.state.dl_token)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/create', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: GET,
  path: '/league/team/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const team = await get(`/league/team/?teamId=${request.query.teamId}`, request.state.dl_token)
    const divisions = await get('/league/divisions', request.state.dl_token)
    return h.view('league/edit-team', { team, divisions })
  },
}, {
  method: POST,
  path: '/league/team/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        teamId: Joi.string().required(),
        name: Joi.string().required(),
        alias: Joi.string().required(),
        divisionId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const divisions = await get('/league/divisions', request.state.dl_token)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/edit', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: GET,
  path: '/league/team/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const team = await get(`/league/team/?teamId=${request.query.teamId}`, request.state.dl_token)
    return h.view('league/delete-team', { team })
  },
}, {
  method: POST,
  path: '/league/team/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const team = await get(`/league/player/?playerId=${request.query.teamId}`, request.state.dl_token)
        return h.view('league/delete-team', { team, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/delete', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: POST,
  path: '/league/teams/autocomplete',
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
      const teams = await post('/league/teams/autocomplete', request.payload, request.state.dl_token)
      return teams.map(function (team) {
        return {
          label: team.name,
          val: team.teamId,
        }
      })
    },
  },
}]
