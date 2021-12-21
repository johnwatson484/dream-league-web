const joi = require('joi')
const api = require('../../api')

module.exports = [{
  method: 'GET',
  path: '/forgot-password',
  handler: (request, h) => {
    return h.view('identity/forgot-password')
  }
},
{
  method: 'POST',
  path: '/forgot-password',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().email().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('identity/forgot-password', {
          message: 'Email format incorrect'
        }).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/forgot-password', request.payload)
      return h.redirect('/')
    }
  }
}]
