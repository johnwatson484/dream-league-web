const Joi = require('joi')
const boom = require('@hapi/boom')
const { get, post } = require('../api')

module.exports = [{
  method: 'GET',
  path: '/results',
  options: {
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().optional()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const gameweekId = request.query?.gameweekId || 0
      const results = await get(`/results?gameweekId=${gameweekId}`, request.state.dl_token)
      const gameweeks = await get('/gameweeks?completed=true', request.state.dl_token)
      return h.view('results', { results, gameweeks })
    }
  }
}, {
  method: 'GET',
  path: '/results/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const resultsInput = await get('/results-edit', request.state.dl_token)
    resultsInput.keepers = resultsInput.keepers.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) })
    resultsInput.players = resultsInput.players.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) || sortFn(a.lastName, b.lastName) || sortFn(a.firstName, b.firstName) })
    return h.view('results-edit', { resultsInput })
  }
}, {
  method: 'POST',
  path: '/results/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        gameweekId: Joi.number(),
        conceded: Joi.array().items(Joi.object({ teamId: Joi.number(), conceded: Joi.number() })).single(),
        concededCup: Joi.array().items(Joi.object({ teamId: Joi.number(), conceded: Joi.number() })).single(),
        goals: Joi.array().items(Joi.object({ playerId: Joi.number(), goals: Joi.number() })).single(),
        goalsCup: Joi.array().items(Joi.object({ playerId: Joi.number(), goals: Joi.number() })).single()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await post('/results-edit', request.payload, request.state.dl_token)
      return h.redirect(`/results?gameweekId=${request.payload.gameweekId}`)
    }
  }
}, {
  method: 'POST',
  path: '/results/send',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: {
      crumb: false
    },
    validate: {
      payload: Joi.object({
        gameweekId: Joi.number().required()
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await post('/results-send', request.payload, request.state.dl_token)
      return h.response()
    }
  }
}]

function sortFn (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}
