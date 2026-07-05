import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { GET, POST } from '../constants/verbs.ts'

const routes: ServerRoute[] = [{
  method: GET,
  path: '/groups',
  options: {
    handler: async (request, h) => {
      const groups = await get('/groups', request)
      return h.view('groups', { groups })
    },
  },
}, {
  method: GET,
  path: '/group/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const cups = await get('/cups', request)
    const managers = await get('/managers', request)
    return h.view('create-group', { cups, managers })
  },
}, {
  method: POST,
  path: '/group/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        cupId: Joi.number().integer().required(),
        name: Joi.string(),
        groupLegs: Joi.number().integer(),
        teamsAdvancing: Joi.number().integer(),
        managers: Joi.array().items(Joi.number().integer()).single(),
      },
      failAction: async (request, h, error) => {
        const cups = await get('/cups', request)
        const managers = await get('/managers', request)
        return h.view('create-group', { error, group: request.payload, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/create', request.payload, request)
      return h.redirect('/groups')
    },
  },
}, {
  method: GET,
  path: '/group/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        groupId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const group = await get(`/group/?groupId=${(request.query as Record<string, unknown>).groupId}`, request)
    const cups = await get('/cups', request)
    const managers = await get('/managers', request)
    return h.view('edit-group', { group, cups, managers })
  },
}, {
  method: POST,
  path: '/group/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        groupId: Joi.number().integer().required(),
        cupId: Joi.number().integer().required(),
        name: Joi.string(),
        groupLegs: Joi.number().integer(),
        teamsAdvancing: Joi.number().integer(),
        managers: Joi.array().items(Joi.number().integer()).single(),
      },
      failAction: async (request, h, error) => {
        const cups = await get('/cups', request)
        const managers = await get('/managers', request)
        return h.view('edit-group', { group: request.payload, error, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/edit', request.payload, request)
      return h.redirect('/groups')
    },
  },
}, {
  method: GET,
  path: '/group/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        groupId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const group = await get(`/group/?groupId=${(request.query as Record<string, unknown>).groupId}`, request)
    return h.view('delete-group', { group })
  },
}, {
  method: POST,
  path: '/group/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        groupId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const group = await get(`/group/?groupId=${(request.query as Record<string, unknown>).groupId}`, request)
        return h.view('delete-group', { group, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/delete', request.payload, request)
      return h.redirect('/groups')
    },
  },
}]

export default routes
