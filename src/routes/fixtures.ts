import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/fixtures',
  handler: async (request, h) => {
    const fixtures = await get('/fixtures', request)
    return h.view('fixtures', { fixtures })
  },
}, {
  method: 'GET',
  path: '/fixture/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const gameweeks = await get('/gameweeks', request)
    const cups = await get('/cups', request)
    const managers = await get('/managers', request)
    return h.view('create-fixture', { gameweeks, cups, managers })
  },
}, {
  method: 'POST',
  path: '/fixture/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const gameweeks = await get('/gameweeks', request)
        const cups = await get('/cups', request)
        const managers = await get('/managers', request)
        return h.view('create-fixture', { error, fixture: request.payload, gameweeks, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/fixture/create', request.payload, request)
      return h.redirect('/fixtures')
    },
  },
}, {
  method: 'GET',
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        fixtureId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const fixture = await get(`/fixture/?fixtureId=${(request.query as Record<string, unknown>).fixtureId}`, request)
    const gameweeks = await get('/gameweeks', request)
    const cups = await get('/cups', request)
    const managers = await get('/managers', request)
    return h.view('edit-fixture', { fixture, gameweeks, cups, managers })
  },
}, {
  method: 'POST',
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        fixtureId: Joi.number().integer().required(),
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const gameweeks = await get('/gameweeks', request)
        const cups = await get('/cups', request)
        const managers = await get('/managers', request)
        return h.view('edit-fixture', { fixture: request.payload, error, gameweeks, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/fixture/edit', request.payload, request)
      return h.redirect('/fixtures')
    },
  },
}, {
  method: 'GET',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        fixtureId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const fixture = await get(`/fixture/?fixtureId=${(request.query as Record<string, unknown>).fixtureId}`, request)
    return h.view('delete-fixture', { fixture })
  },
}, {
  method: 'POST',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        fixtureId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const fixture = await get(`/fixture/?fixtureId=${(request.query as Record<string, unknown>).fixtureId}`, request)
        return h.view('delete-fixture', { fixture, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/fixture/delete', request.payload, request)
      return h.redirect('/fixtures')
    },
  },
}, {
  method: 'GET',
  path: '/fixtures/generate',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
  },
  handler: async (request, h) => {
    const cups = await get('/cups', request) as any[]
    const groupCups = cups.filter((c: any) => c.hasGroupStage)
    const groups = await get('/groups', request)
    const gameweeks = await get('/gameweeks', request)
    return h.view('fixtures-generate', { cups: groupCups, groups, gameweeks })
  },
}, {
  method: 'POST',
  path: '/fixtures/generate',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().integer().required(),
        gameweekIds: Joi.array().items(Joi.number().integer()).single().required(),
      }),
      failAction: async (request, h, error) => {
        const cups = await get('/cups', request) as any[]
        const groupCups = cups.filter((c: any) => c.hasGroupStage)
        const groups = await get('/groups', request)
        const gameweeks = await get('/gameweeks', request)
        return h.view('fixtures-generate', { cups: groupCups, groups, gameweeks, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as { cupId: number; gameweekIds: number[] }
      const generated = await post('/fixtures/generate', payload, request) as any[]
      const managers = await get('/managers', request) as any[]
      const managerMap = new Map(managers.map((m: any) => [m.managerId, m.name]))
      const enriched = generated.map((f: any) => ({
        ...f,
        homeManagerName: managerMap.get(f.homeManagerId) || f.homeManagerId,
        awayManagerName: managerMap.get(f.awayManagerId) || f.awayManagerId,
      }))
      return h.view('fixtures-generate', { generated: enriched })
    },
  },
}, {
  method: 'GET',
  path: '/fixtures/reschedule',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
  },
  handler: async (request, h) => {
    const fixtures = await get('/fixtures', request)
    const gameweeks = await get('/gameweeks', request)
    return h.view('fixtures-reschedule', { fixtures, gameweeks })
  },
}, {
  method: 'POST',
  path: '/fixtures/reschedule',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtures: Joi.array().items(Joi.object({
          fixtureId: Joi.number().integer().required(),
          gameweekId: Joi.number().integer().required(),
        })).single().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await post('/fixtures/reschedule', request.payload, request)
      return h.redirect('/fixtures')
    },
  },
}, {
  method: 'GET',
  path: '/cup/{cupId}/progression',
  handler: async (request, h) => {
    const cupId = request.params.cupId
    const cup = await get(`/cup?cupId=${cupId}`, request)
    const progression = await get(`/cups/${cupId}/progression`, request) as any[]
    const rounds: Record<number, any[]> = {}
    for (const fixture of progression) {
      const round = fixture.round
      if (!rounds[round]) { rounds[round] = [] }
      rounds[round].push(fixture)
    }
    return h.view('cup-progression', { cup, rounds })
  },
}, {
  method: 'POST',
  path: '/cup/{cupId}/resolve',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        winnerManagerId: Joi.number().integer().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const cupId = request.params.cupId
      await post(`/cups/${cupId}/resolve`, request.payload, request)
      return h.redirect(`/cup/${cupId}/progression`)
    },
  },
}]

export default routes
