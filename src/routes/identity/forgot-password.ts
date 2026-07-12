import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { post } from '../../api/post.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/forgot-password',
  options: {
    validate: {
      query: Joi.object({
        sent: Joi.string().valid('true').optional(),
      }),
      failAction: async (_request, h, _error) => {
        return h.view('identity/forgot-password').takeover()
      },
    },
  },
  handler: (request, h) => {
    const sent = (request.query as Record<string, string>).sent === 'true'
    return h.view('identity/forgot-password', {
      message: sent ? 'If your email address is registered you will receive an email with reset instructions.' : undefined,
    })
  },
},
{
  method: 'POST',
  path: '/forgot-password',
  options: {
    validate: {
      payload: {
        email: Joi.string().email().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('identity/forgot-password', {
          message: 'Email format incorrect',
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        await post('/forgot-password', request.payload)
      } catch {
        // swallow - don't reveal whether email exists
      }
      return h.redirect('/forgot-password?sent=true')
    },
  },
}]

export default routes
