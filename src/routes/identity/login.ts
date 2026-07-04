import Joi from 'joi'
import config from '../../config.ts'
import { post } from '../../api/post.ts'
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
        return h.redirect('/')
          .state('dl_token', response.token, config.cookieOptionsIdentity)
      } catch {
        return h.view('identity/login', {
          message: 'Invalid credentials',
        })
      }
    },
  },
}]
