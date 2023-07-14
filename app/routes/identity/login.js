const Joi = require('joi')
const config = require('../../config')
const { post } = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/login',
  handler: (_request, h) => {
    return h.view('identity/login')
  }
},
{
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }),
      failAction: async (_request, h, _error) => {
        return h.view('identity/login', {
          message: 'Email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const response = await post('/login', request.payload)
        return h.redirect('/')
          .header('Authorization', response.token)
          .state('dl_token', response.token, config.cookieOptionsIdentity)
      } catch {
        return h.view('identity/login', {
          message: 'Invalid credentials'
        })
      }
    }
  }
}]
