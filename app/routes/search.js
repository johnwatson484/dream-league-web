const Joi = require('joi')
const boom = require('@hapi/boom')
const { post } = require('../api')
const { POST } = require('../constants/verbs')

module.exports = [{
  method: POST,
  path: '/search/autocomplete',
  options: {
    plugins: {
      crumb: false,
    },
    validate: {
      payload: Joi.object({
        prefix: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const results = await post('/search/autocomplete', request.payload, request.state.dl_token)
      return h.response(results)
    },
  },
}]
