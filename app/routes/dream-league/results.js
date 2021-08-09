const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/results',
  options: {
    validate: {
      query: joi.object({
        gameweekId: joi.number().optional()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      const gameweekId = request.query?.gameweekId || 0
      const results = await api.get(`/dream-league/results?gameweekId=${gameweekId}`, request.state.dl_token)
      const gameweeks = await api.get('/dream-league/gameweeks?completed=true', request.state.dl_token)
      return h.view('dream-league/results', { results, gameweeks })
    }
  }
}, {
  method: 'GET',
  path: '/results/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const resultsInput = await api.get('/dream-league/results-edit', request.state.dl_token)
    resultsInput.keepers = resultsInput.keepers.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) })
    resultsInput.players = resultsInput.players.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) || sortFn(a.lastName, b.lastName) || sortFn(a.firstName, b.firstName) })
    return h.view('dream-league/results-edit', { resultsInput })
  }
}, {
  method: 'POST',
  path: '/results/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        gameweekId: joi.number(),
        conceded: joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })).single(),
        concededCup: joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })).single(),
        goals: joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })).single(),
        goalsCup: joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })).single()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/results-edit', request.payload, request.state.dl_token)
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
      payload: joi.object({
        gameweekId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/results-send', request.payload, request.state.dl_token)
      return h.response()
    }
  }
}]

function sortFn (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}
