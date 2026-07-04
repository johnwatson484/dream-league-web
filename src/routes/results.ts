import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { deleteRequest } from '../api/delete.ts'
import { sortArray } from '../utils/sort-array.ts'
import { GET, POST, DELETE } from '../constants/verbs.ts'

export default [{
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
      const results = await get(`/results?gameweekId=${gameweekId}`, request)
      const gameweeks = await get('/gameweeks?completed=true', request)
      return h.view('results', { results, gameweeks })
    },
  },
}, {
  method: GET,
  path: '/results/edit',
  handler: async (request, h) => {
    const resultsInput = await get('/results-edit', request)
    resultsInput.keepers = resultsInput.keepers.sort((a, b) => { return sortArray(a.division, b.division) || sortArray(a.team, b.team) })
    resultsInput.players = resultsInput.players.sort((a, b) => { return sortArray(a.division, b.division) || sortArray(a.team, b.team) || sortArray(a.lastName, b.lastName) || sortArray(a.firstName, b.firstName) })
    return h.view('results-edit', { resultsInput })
  },
}, {
  method: POST,
  path: '/results/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
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
      await post('/results-edit', request.payload, request)
      return h.redirect(`/results?gameweekId=${request.payload.gameweekId}`)
    },
  },
}, {
  method: POST,
  path: '/results/send',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await post('/results-send', request.payload, request)
      return h.response()
    },
  },
}, {
  method: DELETE,
  path: '/results',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      await deleteRequest('/results', request.payload, request)
      return h.response()
    },
  },
}]
