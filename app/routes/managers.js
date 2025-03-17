const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/managers',
  handler: async (request, h) => {
    const managers = await get('/managers', request.state.dl_token)
    return h.view('managers', { managers })
  },
}, {
  method: GET,
  path: '/manager',
  options: {
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/detail/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('manager', manager)
  },
}, {
  method: GET,
  path: '/manager/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-manager')
  },
}, {
  method: POST,
  path: '/manager/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      },
      failAction: async (request, h, error) => {
        return h.view('create-manager', { error, manager: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/create', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    },
  },
}, {
  method: GET,
  path: '/manager/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(400).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('edit-manager', { manager })
  },
}, {
  method: POST,
  path: '/manager/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        managerId: Joi.number().integer().required(),
        name: Joi.string(),
        alias: Joi.string(),
        emails: Joi.array().items(Joi.string().email().allow('')).single(),
      }),
      failAction: async (request, h, error) => {
        return h.view('league/edit-manager', { manager: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/edit', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    },
  },
}, {
  method: GET,
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const manager = await get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('delete-manager', { manager })
  },
}, {
  method: POST,
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        managerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const manager = await get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
        return h.view('delete-manager', { manager, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/manager/delete', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    },
  },
}]
