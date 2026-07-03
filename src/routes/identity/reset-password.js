import Joi from 'joi'
import { post } from '../../api/post.js'
import { GET, POST } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/reset-password/{token}/{userId}',
  options: {
    validate: {
      params: Joi.object({
        token: Joi.string().required(),
        userId: Joi.number().integer().required(),
      }),
    },
    handler: (request, h) => {
      const { userId, token } = request.params
      return h.view('identity/reset-password', { userId, token })
    },
  },
},
{
  method: POST,
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
          message: 'Passwords must match', ...request.payload,
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        const { userId, password, token } = request.payload
        await post('/reset-password', { userId, password, token })
        return h.redirect('/login')
      } catch {
        return h.view('identity/reset-password', {
          message: 'Link expired',
          userId: request.payload.userId,
          token: request.payload.token,
        })
      }
    },
  },
}]
