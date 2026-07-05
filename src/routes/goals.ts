import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/goals',
  handler: async (request, h) => {
    const goals = await get('/goals', request)
    return h.view('goals', { goals })
  },
}, {
  method: 'GET',
  path: '/goal',
  options: {
    validate: {
      query: {
        goalId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const goal = await get(`/goal/detail/?goalId=${(request.query as Record<string, unknown>).goalId}`, request)
    return h.view('goal', goal as Record<string, unknown>)
  },
}, {
  method: 'GET',
  path: '/goal/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        goalId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const goal = await get(`/goal/?goalId=${(request.query as Record<string, unknown>).goalId}`, request)
    return h.view('delete-goal', { goal })
  },
}, {
  method: 'POST',
  path: '/goal/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        goalId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const goal = await get(`/goal/?goalId=${(request.query as Record<string, unknown>).goalId}`, request)
        return h.view('delete-goal', { goal, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/goal/delete', request.payload, request)
      return h.redirect('/goals')
    },
  },
}]

export default routes
