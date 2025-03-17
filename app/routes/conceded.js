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
  options: {
    validate: {
      query: {
        concedeId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const concede = await get(`/concede/detail/?concedeId=${request.query.concedeId}`, request.state.dl_token)
    return h.view('concede', concede)
  },
}, {
  method: GET,
  path: '/concede/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        concedeId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
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
      payload: {
        concedeId: Joi.number().integer().required(),
      },
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
