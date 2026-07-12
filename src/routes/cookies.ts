import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { updatePolicy } from '../cookies/update-policy.ts'

const { HTTP_STATUS_BAD_REQUEST } = httpConstants

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/cookies',
  options: {
    validate: {
      query: {
        updated: Joi.boolean().default(false),
      },
    },
  },
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', { cookiesPolicy: request.state.cookies_policy, updated: (request.query as Record<string, unknown>).updated })
  },
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    validate: {
      payload: {
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false),
      },
      failAction: async (_request, h, _error) => {
        return h.view('cookies/cookie-policy', { cookiesPolicy: (_request as unknown as { state: Record<string, unknown> }).state.cookies_policy, updated: false }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: (request, h) => {
      const payload = request.payload as { analytics: boolean; async: boolean }
      updatePolicy(request, h, payload.analytics)
      if (payload.async) {
        return h.response('Cookie policy updated')
      }
      return h.redirect('/cookies?updated=true')
    },
  },
}]

export default routes
