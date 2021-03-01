const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')

module.exports = [{
  method: 'GET',
  path: '/results',
  handler: async (request, h) => {
    const results = await api.get('/dream-league/results', request.state.dl_token)
    const gameweeks = await api.get('/dream-league/gameweeks', request.state.dl_token)
    console.log(results.scores[0].scorers)
    return h.view('dream-league/results', { results, gameweeks })
  }
}, {
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    const players = await api.get('/dream-league/results-edit', request.state.dl_token)
    players.keepers = players.keepers.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) })
    players.players = players.players.sort((a, b) => { return sortFn(a.division, b.division) || sortFn(a.team, b.team) || sortFn(a.lastName, b.lastName) || sortFn(a.firstName, b.firstName) })
    return h.view('dream-league/results-edit', { players })
  }
}, {
  method: 'POST',
  path: '/results/edit',
  options: {
    validate: {
      payload: joi.object({
        gameweekId: joi.number(),
        conceded: joi.alternatives().try(joi.array().items(joi.object({ teamId: joi.number(), conceded: joi.number() })), joi.string()),
        goals: joi.alternatives().try(joi.array().items(joi.object({ playerId: joi.number(), goals: joi.number() })), joi.string())
      }),
      failAction: async (request, h, error) => {
        return boom.badRequest(error)
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/results-edit', request.payload, request.state.dl_token)
      return h.redirect('/results')
    }
  }
}]

function sortFn (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}
