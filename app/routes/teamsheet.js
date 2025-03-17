const joi = require('joi')
const boom = require('@hapi/boom')
const { refreshTeamsheet } = require('../refresh')
const { get, post } = require('../api')
const ViewModel = require('./models/teamsheet')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/teamsheet',
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request.state.dl_token)
    return h.view('teamsheet', { teamsheet })
  },
}, {
  method: GET,
  path: '/teamsheet/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request.state.dl_token)
    const teamsheetViewModel = new ViewModel(teamsheet)
    return h.view('teamsheet-edit', { teamsheet: teamsheetViewModel })
  },
}, {
  method: POST,
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: {
      crumb: false,
    },
    validate: {
      payload: {
        managerId: joi.number().integer(),
        playerIds: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
        playerSubs: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/player', request.payload, request.state.dl_token)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: {
      crumb: false,
    },
    validate: {
      payload: joi.object({
        managerId: joi.number().integer(),
        teamIds: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
        teamSubs: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/keeper', request.payload, request.state.dl_token)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false,
    },
    handler: async (request, h) => {
      const response = await refreshTeamsheet(request.payload.teamFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/teamsheet/edit')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped',
      })
    },
  },
}]
