import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { safePath } from '../utils/safe-redirect.ts'

const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } = httpConstants

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
        return h.view('create-fixture', { error, fixture: request.payload, gameweeks, cups, managers }).code(HTTP_STATUS_BAD_REQUEST).takeover()
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
      query: Joi.object({
        fixtureId: Joi.number().integer().required(),
        returnTo: Joi.string().optional(),
      }),
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const query = request.query as Record<string, unknown>
    const fixture = await get(`/fixture/?fixtureId=${query.fixtureId}`, request)
    const gameweeks = await get('/gameweeks', request)
    const cups = await get('/cups', request)
    const managers = await get('/managers', request)
    return h.view('edit-fixture', { fixture, gameweeks, cups, managers, returnTo: query.returnTo })
  },
}, {
  method: 'POST',
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
        returnTo: Joi.string().optional().allow(''),
      }),
      failAction: async (request, h, error) => {
        const gameweeks = await get('/gameweeks', request)
        const cups = await get('/cups', request)
        const managers = await get('/managers', request)
        return h.view('edit-fixture', { fixture: request.payload, error, gameweeks, cups, managers }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as Record<string, unknown>
      const returnTo = safePath(payload.returnTo as string, '/fixtures')
      const { returnTo: _, ...fixturePayload } = payload
      await post('/fixture/edit', fixturePayload, request)
      return h.redirect(returnTo)
    },
  },
}, {
  method: 'GET',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: Joi.object({
        fixtureId: Joi.number().integer().required(),
        returnTo: Joi.string().optional(),
      }),
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const query = request.query as Record<string, unknown>
    const fixture = await get(`/fixture/?fixtureId=${query.fixtureId}`, request)
    return h.view('delete-fixture', { fixture, returnTo: query.returnTo })
  },
}, {
  method: 'POST',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        returnTo: Joi.string().optional().allow(''),
      }),
      failAction: async (request, h, error) => {
        const fixture = await get(`/fixture/?fixtureId=${(request.query as Record<string, unknown>).fixtureId}`, request)
        return h.view('delete-fixture', { fixture, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as Record<string, unknown>
      const returnTo = safePath(payload.returnTo as string, '/fixtures')
      const { returnTo: _, ...fixturePayload } = payload
      await post('/fixture/delete', fixturePayload, request)
      return h.redirect(returnTo)
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
        return h.view('fixtures-generate', { cups: groupCups, groups, gameweeks, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as { cupId: number; gameweekIds: number[] }
      try {
        const generated = await post('/fixtures/generate', payload, request) as any[]
        const managers = await get('/managers', request) as any[]
        const managerMap = new Map(managers.map((m: any) => [m.managerId, m.name]))
        const enriched = generated.map((f: any) => ({
          ...f,
          homeManagerName: managerMap.get(f.homeManagerId) || f.homeManagerId,
          awayManagerName: managerMap.get(f.awayManagerId) || f.awayManagerId,
        }))
        return h.view('fixtures-generate', { generated: enriched })
      } catch (err: any) {
        const errorPayload = err?.data?.payload
        const message = (typeof errorPayload === 'object' ? errorPayload?.message : null) || err?.message || 'Failed to generate fixtures'
        const cups = await get('/cups', request) as any[]
        const groupCups = cups.filter((c: any) => c.hasGroupStage)
        const groups = await get('/groups', request)
        const gameweeks = await get('/gameweeks', request)
        return h.view('fixtures-generate', { cups: groupCups, groups, gameweeks, error: message })
      }
    },
  },
}, {
  method: 'POST',
  path: '/fixtures/clear',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      await post('/fixtures/clear', request.payload, request)
      return h.redirect('/fixtures/generate')
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
  path: '/cup/{cupId}',
  handler: async (request, h) => {
    const cupId = request.params.cupId
    const cup = await get(`/cup?cupId=${cupId}`, request) as any
    const progression = await get(`/cups/${cupId}/progression`, request) as any[]

    let standings: any[] = []
    if (cup.hasGroupStage) {
      standings = await get(`/cups/${cupId}/standings`, request) as any[]
    }

    let managers: any[] = []
    let gameweeks: any[] = []
    if (request.auth.isAuthenticated && request.auth.credentials?.scope?.includes('admin')) {
      managers = await get('/managers', request) as any[]
      gameweeks = await get('/gameweeks', request) as any[]
    }

    const rounds: Record<number, any[]> = {}
    for (const fixture of progression) {
      const round = fixture.round
      rounds[round] ??= []
      rounds[round].push(fixture)
    }

    return h.view('cup-page', { cup, standings, rounds, managers, gameweeks })
  },
}, {
  method: 'GET',
  path: '/cup/{cupId}/progression',
  handler: async (request, h) => {
    return h.redirect(`/cup/${request.params.cupId}`).permanent()
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
      return h.redirect(`/cup/${cupId}`)
    },
  },
}, {
  method: 'POST',
  path: '/cup/{cupId}/unresolve',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const cupId = request.params.cupId
      await post(`/cups/${cupId}/unresolve`, request.payload, request)
      return h.redirect(`/cup/${cupId}`)
    },
  },
}, {
  method: 'POST',
  path: '/cup/{cupId}/create-fixture',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        round: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const cupId = request.params.cupId
      const payload = { ...(request.payload as object), cupId: Number(cupId) }
      await post('/fixture/create', payload, request)
      return h.redirect(`/cup/${cupId}`)
    },
  },
}]

export default routes
