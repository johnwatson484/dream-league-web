import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { post } from '../../api/post.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/reset-password/{token}/{userId}',
  options: {
    validate: {
      params: Joi.object({
        token: Joi.string().required(),
        userId: Joi.number().integer().required(),
      }),
    },
    handler: (request, h) => {
      const { userId, token } = request.params as unknown as { userId: number; token: string }
      return h.view('identity/reset-password', { userId, token })
    },
  },
},
{
  method: 'POST',
  path: '/reset-password',
  options: {
    validate: {
      payload: {
        userId: Joi.number().integer().required(),
        token: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      },
      failAction: async (request, h, _error) => {
        return h.view('identity/reset-password', {
          message: 'Passwords must match', ...(request.payload as Record<string, unknown>),
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload as { userId: number; password: string; token: string }
        const { userId, password, token } = payload
        await post('/reset-password', { userId, password, token })
        return h.redirect('/login')
      } catch {
        const payload = request.payload as { userId: number; token: string }
        return h.view('identity/reset-password', {
          message: 'Link expired',
          userId: payload.userId,
          token: payload.token,
        })
      }
    },
  },
}]

export default routes
