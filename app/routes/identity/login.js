const joi = require('@hapi/joi')
const config = require('../../config')
const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/login',
  handler: (request, h) => {
    return h.view('identity/login')
  }
},
{
  method: 'POST',
  path: '/login',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('login', {
          message: 'Email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const response = await api.post('/login', request.payload)
        const payloadRaw = JSON.parse(response.toString())
        return h.redirect('/')
          .header('Authorization', payloadRaw.token)
          .state('dl_token', payloadRaw.token, config.cookieOptions)
      } catch {
        return h.view('identity/login', {
          message: 'Invalid credentials'
        })
      }
    }
  }
}]
