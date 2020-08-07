const wreck = require('wreck')
const joi = require('@hapi/joi')
const config = require('../../config')

module.exports = [{
  method: 'GET',
  path: '/register',
  handler: (request, h) => {
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
      failAction: async (request, h, error) => {
        return h.view('register', {
          message: 'email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { payload } = await wreck.post(`${config.apiHost}/register`, {
          payload: request.payload
        })

        const payloadRaw = JSON.parse(payload.toString())
        if (!payloadRaw) {
          return h.view('register', {
            message: 'email already registered'
          })
        }
        return h.redirect('/')
          .header('Authorization', payloadRaw.token)
          .state('dl_token', payloadRaw.token, config.cookieOptions)
      } catch {
        return h.view('identity/register', {
          message: 'invalid credentials'
        })
      }
    }
  }
}]
