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
  method: 'GET',
  path: '/league/team/create',
  handler: async (request, h) => {
    const divisions = await api.get('/league/divisions', request.state.dl_token)
    return h.view('league/create-team', { divisions })
  }
}, {
  method: 'POST',
  path: '/league/team/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string().required(),
        alias: joi.string().required(),
        divisionId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const divisions = await api.get('/league/divisions', request.state.dl_token)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/team/create', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    }
  }
}, {
  method: 'GET',
  path: '/league/team/edit',
  handler: async (request, h) => {
    const team = await api.get(`/league/team/?teamId=${request.query.teamId}`, request.state.dl_token)
    const divisions = await api.get('/league/divisions', request.state.dl_token)
    return h.view('league/edit-team', { team, divisions })
  }
}, {
  method: 'POST',
  path: '/league/team/edit',
  options: {
    validate: {
      payload: joi.object({
        teamId: joi.string().required(),
        name: joi.string().required(),
        alias: joi.string().required(),
        divisionId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const divisions = await api.get('/league/divisions', request.state.dl_token)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/team/edit', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    }
  }
}, {
  method: 'GET',
  path: '/league/team/delete',
  handler: async (request, h) => {
    const team = await api.get(`/league/team/?teamId=${request.query.teamId}`, request.state.dl_token)
    return h.view('league/delete-team', { team })
  }
}, {
  method: 'POST',
  path: '/league/team/delete',
  options: {
    validate: {
      payload: joi.object({
        teamId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const team = await api.get(`/league/player/?playerId=${request.query.teamId}`, request.state.dl_token)
        return h.view('league/delete-team', { team, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/league/team/delete', request.payload, request.state.dl_token)
      return h.redirect('/league/teams')
    }
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
