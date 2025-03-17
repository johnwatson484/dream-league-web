const Joi = require('joi')
const { post } = require('../../api')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/reset-password',
  options: {
    validate: {
      query: {
        token: Joi.string().required(),
        userId: Joi.number().integer().required(),
      },
    },
    handler: (request, h) => {
      const { userId, token } = request.query
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
