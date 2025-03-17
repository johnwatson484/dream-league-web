const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/history',
  handler: async (request, h) => {
    const history = await get('/history', request.state.dl_token)
    return h.view('history', { history })
  },
}, {
  method: GET,
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  path: '/history/create',
  handler: async (_request, h) => {
    return h.view('create-history')
  },
}, {
  method: POST,
  path: '/history/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        year: Joi.number().integer().required(),
        teams: Joi.number().integer(),
        league1: Joi.string().allow(''),
        league2: Joi.string().allow(''),
        cup: Joi.string().allow(''),
        leagueCup: Joi.string().allow(''),
        plate: Joi.string().allow(''),
      },
      failAction: async (request, h, error) => {
        return h.view('create-history', { error, history: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/history/create', request.payload, request.state.dl_token)
      return h.redirect('/history')
    },
  },
}, {
  method: GET,
  path: '/history/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        historyId: Joi.number().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const history = await get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('edit-history', { history })
  },
}, {
  method: POST,
  path: '/history/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        historyId: Joi.number().integer().required(),
        year: Joi.number().integer().required(),
        teams: Joi.number().integer(),
        league1: Joi.string().allow(''),
        league2: Joi.string().allow(''),
        cup: Joi.string().allow(''),
        leagueCup: Joi.string().allow(''),
        plate: Joi.string().allow(''),
      },
      failAction: async (request, h, error) => {
        return h.view('league/edit-history', { history: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/history/edit', request.payload, request.state.dl_token)
      return h.redirect('/history')
    },
  },
}, {
  method: GET,
  path: '/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        historyId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const history = await get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('delete-history', { history })
  },
}, {
  method: POST,
  path: '/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        historyId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const history = await get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
        return h.view('delete-history', { history, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/history/delete', request.payload, request.state.dl_token)
      return h.redirect('/history')
    },
  },
}]
