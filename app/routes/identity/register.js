const Joi = require('joi')
const config = require('../../config')
const { post } = require('../../api')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/register',
  handler: (_request, h) => {
    return h.view('identity/register')
  },
},
{
  method: POST,
  path: '/register',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
      failAction: async (_request, h, _error) => {
        return h.view('identity/register', {
          message: 'email format incorrect',
        }).takeover()
      },
    },
    handler: async (request, h) => {
      try {
        const response = await post('/register', request.payload)
        if (!response) {
          return h.view('identity/register', {
            message: 'Email already registered or not a league member',
          })
        }
        return h.redirect('/')
          .header('Authorization', response.token)
          .state('dl_token', response.token, config.cookieOptionsIdentity)
      } catch {
        return h.view('identity/register', {
          message: 'Invalid credentials',
        })
      }
    },
  },
}]
