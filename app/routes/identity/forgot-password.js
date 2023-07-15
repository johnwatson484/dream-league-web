const Joi = require('joi')
const { post } = require('../../api')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/forgot-password',
  handler: (_request, h) => {
    return h.view('identity/forgot-password')
  }
},
{
  method: POST,
  path: '/forgot-password',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required()
      }),
      failAction: async (_request, h, _error) => {
        return h.view('identity/forgot-password', {
          message: 'Email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/forgot-password', request.payload)
      return h.redirect('/')
    }
  }
}]
