const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/conceded',
  handler: async (request, h) => {
    const conceded = await get('/conceded', request.state.dl_token)
    return h.view('conceded', { conceded })
  },
}, {
  method: GET,
  path: '/concede',
  handler: async (request, h) => {
    const concede = await get(`/concede/detail/?concedeId=${request.query.concedeId}`, request.state.dl_token)
    return h.view('concede', concede)
  },
}, {
  method: GET,
  path: '/concede/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const concede = await get(`/concede/?concedeId=${request.query.concedeId}`, request.state.dl_token)
    return h.view('delete-concede', { concede })
  },
}, {
  method: POST,
  path: '/concede/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        concedeId: Joi.number().required(),
      }),
      failAction: async (request, h, error) => {
        const concede = await get(`/concede/?concedeId=${request.query.concedeId}`, request.state.dl_token)
        return h.view('delete-concede', { concede, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/concede/delete', request.payload, request.state.dl_token)
      return h.redirect('/conceded')
    },
  },
}]
