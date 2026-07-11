import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import Wreck from '@hapi/wreck'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { deleteRequest } from '../api/delete.ts'
import { compare } from '../utils/compare.ts'
import config from '../config.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/results',
  options: {
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().integer().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const gameweekId = Number((request.query as Record<string, unknown>)?.gameweekId) || 0
      const results = await get(`/results?gameweekId=${gameweekId}`, request)
      const gameweeks = await get('/gameweeks?completed=true', request)
      return h.view('results', { results, gameweeks })
    },
  },
}, {
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    const resultsInput = await get('/results-edit', request) as { keepers: { division: string; team: string }[]; players: { division: string; team: string; lastName: string; firstName: string }[] }
    resultsInput.keepers = resultsInput.keepers.toSorted((a, b) => { return compare(a.division, b.division) || compare(a.team, b.team) })
    resultsInput.players = resultsInput.players.toSorted((a, b) => { return compare(a.division, b.division) || compare(a.team, b.team) || compare(a.lastName, b.lastName) || compare(a.firstName, b.firstName) })
    return h.view('results-edit', { resultsInput })
  },
}, {
  method: 'POST',
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
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await post('/results-edit', request.payload, request)
      return h.redirect(`/results?gameweekId=${(request.payload as Record<string, unknown>).gameweekId}`)
    },
  },
}, {
  method: 'POST',
  path: '/results/send',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await post('/results-send', request.payload, request)
      return h.response()
    },
  },
}, {
  method: 'GET',
  path: '/results/existing',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const gameweekId = (request.query as Record<string, unknown>).gameweekId
      const existing = await get(`/results-edit/existing?gameweekId=${gameweekId}`, request)
      return h.response(existing as object)
    },
  },
}, {
  method: 'GET',
  path: '/results/assisted',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: Joi.object({
        gameweekId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const gameweekId = Number((request.query as Record<string, unknown>).gameweekId)
      const gameweeks = await get('/gameweeks', request) as any[]
      const gameweek = gameweeks.find((gw: any) => gw.gameweekId === gameweekId)
      if (!gameweek) {
        return boom.notFound('Gameweek not found')
      }

      const startDate = new Date(gameweek.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)

      const videprinterUrl = `${config.get('videprinterHost')}/videprinter/summary?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
      try {
        const { payload } = await Wreck.get(videprinterUrl, { json: true })
        return h.response(payload as object)
      } catch {
        return boom.badGateway('Unable to reach videprinter service')
      }
    },
  },
}, {
  method: 'DELETE',
  path: '/results',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        gameweekId: Joi.number().integer().required(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await deleteRequest('/results', request.payload, request)
      return h.response()
    },
  },
}]

export default routes
