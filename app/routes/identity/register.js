const joi = require('joi')
const config = require('../../config')
const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/register',
  handler: (_request, h) => {
    return h.view('identity/register')
  }
},
{
  method: 'POST',
  path: '/register',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      }),
      failAction: async (_request, h, _error) => {
        return h.view('identity/register', {
          message: 'email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const response = await api.post('/register', request.payload)
        if (!response) {
          return h.view('identity/register', {
            message: 'Email already registered or not a league member'
          })
        }
        return h.redirect('/')
          .header('Authorization', response.token)
          .state('dl_token', response.token, config.cookieOptionsIdentity)
      } catch {
        return h.view('identity/register', {
          message: 'Invalid credentials'
        })
      }
    }
  }
}]
