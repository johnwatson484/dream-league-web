const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/managers',
  handler: async (request, h) => {
    const managers = await api.get('/managers', request.state.dl_token)
    return h.view('managers', { managers })
  }
}, {
  method: 'GET',
  path: '/manager',
  handler: async (request, h) => {
    const manager = await api.get(`/manager/detail/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('manager', manager)
  }
}, {
  method: 'GET',
  path: '/manager/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-manager')
  }
}, {
  method: 'POST',
  path: '/manager/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        name: joi.string(),
        alias: joi.string(),
        emails: joi.array().items(joi.string().email().allow('')).single()
      }),
      failAction: async (request, h, error) => {
        return h.view('create-manager', { error, manager: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/manager/create', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    }
  }
}, {
  method: 'GET',
  path: '/manager/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const manager = await api.get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('edit-manager', { manager })
  }
}, {
  method: 'POST',
  path: '/manager/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        managerId: joi.number().required(),
        name: joi.string(),
        alias: joi.string(),
        emails: joi.array().items(joi.string().email().allow('')).single()
      }),
      failAction: async (request, h, error) => {
        return h.view('league/edit-manager', { manager: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/manager/edit', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    }
  }
}, {
  method: 'GET',
  path: '/manager/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const manager = await api.get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('delete-manager', { manager })
  }
}, {
  method: 'POST',
  path: '/manager/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        managerId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const manager = await api.get(`/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
        return h.view('delete-manager', { manager, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/manager/delete', request.payload, request.state.dl_token)
      return h.redirect('/managers')
    }
  }
}]
