const wreck = require('wreck')
const joi = require('@hapi/joi')
const config = require('../../config')

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
          message: 'email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { payload } = await wreck.post(`${config.apiHost}/login`, {
          payload: request.payload
        })

        const payloadRaw = JSON.parse(payload.toString())
        return h.redirect('/')
          .header('Authorization', payloadRaw.token)
          .state('dl_token', payloadRaw.token, config.cookieOptions)
      } catch {
        return h.view('identity/login', {
          message: 'invalid credentials'
        })
      }
    }
  }
}]
