import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const { HTTP_STATUS_BAD_REQUEST } = httpConstants

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/goal-report',
  options: {
    auth: { strategy: 'session', scope: ['user'] },
    validate: {
      query: Joi.object({
        success: Joi.string().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const formData = await get('/goal-reports/form-data', request)
      const success = (request.query as Record<string, unknown>).success === 'true'
      return h.view('goal-report', { formData, success })
    },
  },
}, {
  method: 'POST',
  path: '/goal-report',
  options: {
    auth: { strategy: 'session', scope: ['user'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number().integer().required(),
        playerId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        goals: Joi.number().integer().min(0).max(10).required(),
        goalsCup: Joi.number().integer().min(0).max(10).default(0),
        reason: Joi.string().max(500).allow('', null).optional(),
      }),
      failAction: async (request, h, _error) => {
        const formData = await get('/goal-reports/form-data', request)
        return h.view('goal-report', { formData, error: 'Please check your input and try again.' }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        await post('/goal-reports', request.payload, request)
        return h.redirect('/goal-report?success=true')
      } catch (error: any) {
        const formData = await get('/goal-reports/form-data', request)
        const message = error?.data?.payload?.message || 'Unable to submit goal report.'
        return h.view('goal-report', { formData, error: message })
      }
    },
  },
}, {
  method: 'GET',
  path: '/goal-reports',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    handler: async (request, h) => {
      const goalReports = await get('/goal-reports', request)
      return h.view('goal-reports', { goalReports })
    },
  },
}, {
  method: 'POST',
  path: '/goal-report/accept',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        goalReportId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const { goalReportId } = request.payload as any
      await post(`/goal-reports/${goalReportId}/accept`, {}, request)
      return h.redirect('/goal-reports')
    },
  },
}, {
  method: 'POST',
  path: '/goal-report/reject',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        goalReportId: Joi.number().integer().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const { goalReportId } = request.payload as any
      await post(`/goal-reports/${goalReportId}/reject`, {}, request)
      return h.redirect('/goal-reports')
    },
  },
}]

export default routes
