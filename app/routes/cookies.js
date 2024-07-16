const Joi = require('joi')
const { updatePolicy } = require('../cookies')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', { cookiesPolicy: request.state.cookies_policy, updated: request.query.updated || false })
  },
}, {
  method: POST,
  path: '/cookies',
  options: {
    plugins: {
      crumb: false,
    },
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false),
      }),
      failAction: async (request, h, _error) => {
        return h.view('cookies/cookie-policy', { cookiesPolicy: request.state.cookies_policy, updated: false }).code(400).takeover()
      },
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response()
      }
      return h.redirect('/cookies?updated=true')
    },
  },
}]
