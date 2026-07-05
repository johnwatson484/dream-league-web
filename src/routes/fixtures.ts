import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
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
}]

export default routes
