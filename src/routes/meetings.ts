import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import { GET, POST } from '../constants/verbs.ts'

const routes: ServerRoute[] = [{
  method: GET,
  path: '/meetings',
  handler: async (request, h) => {
    const meetings = await get('/meetings', request)
    return h.view('meetings', { meetings })
  },
}, {
  method: GET,
  path: '/meeting/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-meeting')
  },
}, {
  method: POST,
  path: '/meeting/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        date: Joi.date(),
      },
      failAction: async (request, h, error) => {
        return h.view('create-meeting', { error, meeting: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/create', request.payload, request)
      return h.redirect('/meetings')
    },
  },
}, {
  method: GET,
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        meetingId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const meeting = await get(`/meeting/?meetingId=${(request.query as Record<string, unknown>).meetingId}`, request)
    return h.view('edit-meeting', { meeting })
  },
}, {
  method: POST,
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        meetingId: Joi.number().integer().required(),
        date: Joi.date(),
      },
      failAction: async (request, h, error) => {
        return h.view('league/edit-meeting', { meeting: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/edit', request.payload, request)
      return h.redirect('/meetings')
    },
  },
}, {
  method: GET,
  path: '/meeting/delete',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await get(`/meeting/?meetingId=${(request.query as Record<string, unknown>).meetingId}`, request)
    return h.view('delete-meeting', { meeting })
  },
}, {
  method: POST,
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        meetingId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const meeting = await get(`/meeting/?meetingId=${(request.query as Record<string, unknown>).meetingId}`, request)
        return h.view('delete-meeting', { meeting, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/delete', request.payload, request)
      return h.redirect('/meetings')
    },
  },
}]

export default routes
