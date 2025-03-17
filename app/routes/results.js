const Joi = require('joi')
const boom = require('@hapi/boom')
const { get, post, deleteRequest } = require('../api')
const { sortArray } = require('../utils/sort-array')
const { GET, POST, DELETE } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/results',
  options: {
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().integer().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const gameweekId = request.query?.gameweekId || 0
      const results = await get(`/results?gameweekId=${gameweekId}`, request.state.dl_token)
      const gameweeks = await get('/gameweeks?completed=true', request.state.dl_token)
      return h.view('results', { results, gameweeks })
    },
  },
}, {
  method: GET,
  path: '/results/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const resultsInput = await get('/results-edit', request.state.dl_token)
    resultsInput.keepers = resultsInput.keepers.sort((a, b) => { return sortArray(a.division, b.division) || sortArray(a.team, b.team) })
    resultsInput.players = resultsInput.players.sort((a, b) => { return sortArray(a.division, b.division) || sortArray(a.team, b.team) || sortArray(a.lastName, b.lastName) || sortArray(a.firstName, b.firstName) })
    return h.view('results-edit', { resultsInput })
  },
}, {
  method: POST,
  path: '/results/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        gameweekId: Joi.number().integer(),
        conceded: Joi.array().items(Joi.object({ teamId: Joi.number().integer(), conceded: Joi.number().integer() })).single(),
        concededCup: Joi.array().items(Joi.object({ teamId: Joi.number().integer(), conceded: Joi.number().integer() })).single(),
        goals: Joi.array().items(Joi.object({ playerId: Joi.number().integer(), goals: Joi.number().integer() })).single(),
        goalsCup: Joi.array().items(Joi.object({ playerId: Joi.number().integer(), goals: Joi.number().integer() })).single(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await post('/results-edit', request.payload, request.state.dl_token)
      return h.redirect(`/results?gameweekId=${request.payload.gameweekId}`)
    },
  },
}, {
  method: POST,
  path: '/results/send',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await post('/results-send', request.payload, request.state.dl_token)
      return h.response()
    },
  },
}, {
  method: DELETE,
  path: '/results',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await deleteRequest('/results', request.payload, request.state.dl_token)
      return h.response()
    },
  },
}]
