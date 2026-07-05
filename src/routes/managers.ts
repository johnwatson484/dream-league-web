import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { GET, POST } from '../constants/verbs.ts'

const routes: ServerRoute[] = [{
  method: GET,
  path: '/managers',
  handler: async (request, h) => {
    const managers = await get('/managers', request)
    return h.view('managers', { managers })
  },
}, {
  method: GET,
  path: '/manager',
  options: {
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/detail/?managerId=${(request.query as Record<string, unknown>).managerId}`, request)
    return h.view('manager', manager as Record<string, unknown>)
  },
}, {
  method: GET,
  path: '/manager/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-manager')
  },
}, {
  method: POST,
  path: '/manager/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      },
      failAction: async (request, h, error) => {
        return h.view('create-manager', { error, manager: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/create', request.payload, request)
      return h.redirect('/managers')
    },
  },
}, {
  method: GET,
  path: '/manager/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/?managerId=${(request.query as Record<string, unknown>).managerId}`, request)
    return h.view('edit-manager', { manager })
  },
}, {
  method: POST,
  path: '/manager/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number().integer().required(),
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      }),
      failAction: async (request, h, error) => {
        return h.view('league/edit-manager', { manager: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/edit', request.payload, request)
      return h.redirect('/managers')
    },
  },
}, {
  method: GET,
  path: '/manager/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/?managerId=${(request.query as Record<string, unknown>).managerId}`, request)
    return h.view('delete-manager', { manager })
  },
}, {
  method: POST,
  path: '/manager/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const manager = await get(`/manager/?managerId=${(request.query as Record<string, unknown>).managerId}`, request)
        return h.view('delete-manager', { manager, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/delete', request.payload, request)
      return h.redirect('/managers')
    },
  },
}]

export default routes
