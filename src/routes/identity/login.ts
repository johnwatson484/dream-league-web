import Joi from 'joi'
import config from '../../config.ts'
import { post } from '../../api/post.ts'
import { createSession } from '../../session/session-manager.ts'
import { GET, POST } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/login',
  handler: (_request, h) => {
    return h.view('identity/login')
  },
},
{
  method: POST,
  path: '/login',
  options: {
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('identity/login', {
          message: 'Email format incorrect',
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        const response = await post('/login', request.payload)
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
        return h.view('identity/login', {
          message: 'Invalid credentials',
        })
      }
    },
  },
}]
