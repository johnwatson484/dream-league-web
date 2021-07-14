const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/managers',
  handler: async (request, h) => {
    const managers = await api.get('/dream-league/managers', request.state.dl_token)
    return h.view('dream-league/managers', { managers })
  }
}, {
  method: 'GET',
  path: '/dream-league/manager/create',
  handler: async (request, h) => {
    return h.view('dream-league/create-manager')
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/create',
  options: {
    validate: {
      payload: joi.object({
        name: joi.string(),
        alias: joi.string(),
        emails: joi.array().items(joi.string().email().allow('')).single()
      }),
      failAction: async (request, h, error) => {
        return h.view('dream-league/create-manager', { error, manager: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/manager/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/managers')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/manager/edit',
  handler: async (request, h) => {
    const manager = await api.get(`/dream-league/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('dream-league/edit-manager', { manager })
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/edit',
  options: {
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
      await api.post('/dream-league/manager/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/managers')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/manager/delete',
  handler: async (request, h) => {
    const manager = await api.get(`/dream-league/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
    return h.view('dream-league/delete-manager', { manager })
  }
}, {
  method: 'POST',
  path: '/dream-league/manager/delete',
  options: {
    validate: {
      payload: joi.object({
        managerId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const manager = await api.get(`/dream-league/manager/?managerId=${request.query.managerId}`, request.state.dl_token)
        return h.view('dream-league/delete-manager', { manager, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/manager/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/managers')
    }
  }
}]
