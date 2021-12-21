const joi = require('joi')
const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/reset-password',
  options: {
    validate: {
      query: joi.object({
        token: joi.string().required(),
        userId: joi.number().required()
      })
    },
    handler: (request, h) => {
      const { userId, token } = request.query
      return h.view('identity/reset-password', { userId, token })
    }
  }
},
{
  method: 'POST',
  path: '/reset-password',
  options: {
    validate: {
      payload: joi.object({
        userId: joi.number().required(),
        token: joi.string().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required()
      }),
      failAction: async (request, h, error) => {
        return h.view('identity/reset-password', {
          message: 'Passwords must match', ...request.payload
        }).takeover()
      }
    },
    handler: async (request, h) => {
      try {
        const { userId, password, token } = request.payload
        await api.post('/reset-password', { userId, password, token })
        return h.redirect('/login')
      } catch {
        return h.view('identity/reset-password', {
          message: 'Link expired',
          userId: request.payload.userId,
          token: request.payload.token
        })
      }
    }
  }
}]
