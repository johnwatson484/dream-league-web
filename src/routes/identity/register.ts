import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import config from '../../config.ts'
import { post } from '../../api/post.ts'
import { createSession } from '../../session/session-manager.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/register',
  handler: (_request, h) => {
    return h.view('identity/register')
  },
},
{
  method: 'POST',
  path: '/register',
  options: {
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('identity/register', {
          message: 'email format incorrect',
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        const response = await post('/register', request.payload) as { accessToken: string; refreshToken: string; userId: number; roles?: string[] } | null
        if (!response) {
          return h.view('identity/register', {
            message: 'Email already registered or not a league member',
          })
        }
        const sessionId = await createSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.userId,
          roles: response.roles || [],
          accessTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        })
        return h.redirect('/')
          .state(config.get('session.cookieName'), { sessionId })
      } catch {
        return h.view('identity/register', {
          message: 'Invalid credentials',
        })
      }
    },
  },
}]

export default routes
