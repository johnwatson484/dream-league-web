const { refreshTeamsheet } = require('../refresh')
const api = require('../api')
const joi = require('joi')
const boom = require('@hapi/boom')
const ViewModel = require('./models/teamsheet')

module.exports = [{
  method: 'GET',
  path: '/teamsheet',
  handler: async (request, h) => {
    const teamsheet = await api.get('/teamsheet', request.state.dl_token)
    return h.view('teamsheet', { teamsheet })
  }
}, {
  method: 'GET',
  path: '/teamsheet/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const teamsheet = await api.get('/teamsheet', request.state.dl_token)
    const teamsheetViewModel = new ViewModel(teamsheet)
    return h.view('teamsheet-edit', { teamsheet: teamsheetViewModel })
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: {
      crumb: false
    },
    validate: {
      payload: joi.object({
        managerId: joi.number(),
        playerIds: joi.alternatives().try(joi.array().items(joi.number()), joi.number()),
        playerSubs: joi.alternatives().try(joi.array().items(joi.number()), joi.number())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return api.post('/teamsheet/edit/player', request.payload, request.state.dl_token)
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: {
      crumb: false
    },
    validate: {
      payload: joi.object({
        managerId: joi.number(),
        teamIds: joi.alternatives().try(joi.array().items(joi.string()), joi.string()),
        teamSubs: joi.alternatives().try(joi.array().items(joi.string()), joi.string())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      return api.post('/teamsheet/edit/keeper', request.payload, request.state.dl_token)
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false
    },
    handler: async (request, h) => {
      const response = await refreshTeamsheet(request.payload.teamFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/teamsheet/edit')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped'
      })
    }
  }
}]
