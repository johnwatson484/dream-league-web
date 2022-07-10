const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/cups',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const cups = await api.get('/cups', request.state.dl_token)
      return h.view('cups', { cups })
    }
  }
}, {
  method: 'GET',
  path: '/cup/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-cup')
  }
}, {
  method: 'POST',
  path: '/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        name: joi.string(),
        hasGroupStage: joi.boolean().default(false),
        knockoutLegs: joi.number().integer().default(1)
      }),
      failAction: async (request, h, error) => {
        return h.view('create-cup', { error, cup: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/cup/create', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}, {
  method: 'GET',
  path: '/cup/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await api.get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('edit-cup', { cup })
  }
}, {
  method: 'POST',
  path: '/cup/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().integer().required(),
        name: joi.string(),
        hasGroupStage: joi.boolean().required(),
        knockoutLegs: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('edit-cup', { cup: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/cup/edit', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}, {
  method: 'GET',
  path: '/cup/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await api.get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('delete-cup', { cup })
  }
}, {
  method: 'POST',
  path: '/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const cup = await api.get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
        return h.view('delete-cup', { cup, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/cup/delete', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}]
