import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } = httpConstants

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/conceded',
  handler: async (request, h) => {
    const conceded = await get('/conceded', request)
    return h.view('conceded', { conceded })
  },
}, {
  method: 'GET',
  path: '/concede',
  options: {
    validate: {
      query: {
        concedeId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const concede = await get(`/concede/detail/?concedeId=${(request.query as Record<string, unknown>).concedeId}`, request)
    return h.view('concede', concede as Record<string, unknown>)
  },
}, {
  method: 'GET',
  path: '/concede/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        concedeId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const concede = await get(`/concede/?concedeId=${(request.query as Record<string, unknown>).concedeId}`, request)
    return h.view('delete-concede', { concede })
  },
}, {
  method: 'POST',
  path: '/concede/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        concedeId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const concede = await get(`/concede/?concedeId=${(request.query as Record<string, unknown>).concedeId}`, request)
        return h.view('delete-concede', { concede, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/concede/delete', request.payload, request)
      return h.redirect('/conceded')
    },
  },
}]

export default routes
