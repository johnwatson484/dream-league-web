const refreshTeamSheet = require('../../dream-league/teamsheet-refresh')
const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')
const ViewModel = require('../../view-models/teamsheet')

module.exports = [{
  method: 'GET',
  path: '/teamsheet',
  handler: async (request, h) => {
    const teamsheet = await api.get('/dream-league/teamsheet', request.state.dl_token)
    return h.view('dream-league/teamsheet', { teamsheet })
  }
}, {
  method: 'GET',
  path: '/teamsheet/edit',
  handler: async (request, h) => {
    const teamsheet = await api.get('/dream-league/teamsheet', request.state.dl_token)
    const teamsheetViewModel = new ViewModel(teamsheet)
    return h.view('dream-league/teamsheet-edit', { teamsheet: teamsheetViewModel })
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/player',
  options: {
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
      return await api.post('/dream-league/teamsheet/edit/player', request.payload, request.state.dl_token)
    }
  }
}, {
  method: 'POST',
  path: '/teamsheet/edit/keeper',
  options: {
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
      return await api.post('/dream-league/teamsheet/edit/keeper', request.payload, request.state.dl_token)
    }
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
        return h.redirect('/teamsheet/edit')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped'
      })
    }
  }
}]
