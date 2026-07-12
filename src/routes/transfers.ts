import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } = httpConstants

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/transfers',
  handler: async (request, h) => {
    const transfers = await get('/transfers', request)
    return h.view('transfers', { transfers })
  },
}, {
  method: 'GET',
  path: '/transfer/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const managers = await get('/managers', request)
    const players = await get('/league/players', request)
    const meetings = await get('/meetings', request)
    return h.view('create-transfer', { managers, players, meetings })
  },
}, {
  method: 'POST',
  path: '/transfer/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        managerId: Joi.number().integer().required(),
        playerInId: Joi.number().integer().required(),
        playerOutId: Joi.number().integer().allow('').optional(),
        meetingId: Joi.number().integer().allow('').optional(),
        type: Joi.string().valid('sealed-bid', 'open-bid', 'auction').required(),
        created: Joi.date().required(),
      },
      failAction: async (request, h, error) => {
        const managers = await get('/managers', request)
        const players = await get('/league/players', request)
        const meetings = await get('/meetings', request)
        return h.view('create-transfer', { managers, players, meetings, error, transfer: request.payload }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as Record<string, unknown>
      const data = {
        ...payload,
        playerOutId: payload.playerOutId || null,
        meetingId: payload.meetingId || null,
      }
      await post('/transfer/create', data, request)
      return h.redirect('/transfers')
    },
  },
}, {
  method: 'GET',
  path: '/transfer/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        transferId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const transfers = await get('/transfers', request) as any[]
    const transfer = transfers.find((t: any) => t.transferId === Number((request.query as Record<string, unknown>).transferId))
    return h.view('delete-transfer', { transfer })
  },
}, {
  method: 'POST',
  path: '/transfer/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        transferId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const transfers = await get('/transfers', request) as any[]
        const transfer = transfers.find((t: any) => t.transferId === Number((request.payload as Record<string, unknown>).transferId))
        return h.view('delete-transfer', { transfer, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/transfer/delete', request.payload, request)
      return h.redirect('/transfers')
    },
  },
}]

export default routes
