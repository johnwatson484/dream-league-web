const Joi = require('joi')
const { updatePolicy } = require('../cookies')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/cookies',
  options: {
    validate: {
      query: {
        updated: Joi.boolean().default(false),
      },
    },
  },
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', { cookiesPolicy: request.state.cookies_policy, updated: request.query.updated })
  },
}, {
  method: POST,
  path: '/cookies',
  options: {
    validate: {
      payload: {
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false),
      },
      failAction: async (request, h, _error) => {
        return h.view('cookies/cookie-policy', { cookiesPolicy: request.state.cookies_policy, updated: false }).code(400).takeover()
      },
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('Cookie policy updated')
      }
      return h.redirect('/cookies?updated=true')
    },
  },
}]
