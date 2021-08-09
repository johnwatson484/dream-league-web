const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/cups',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const cups = await api.get('/dream-league/cups', request.state.dl_token)
      return h.view('dream-league/cups', { cups })
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/cup/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    return h.view('dream-league/create-cup')
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        name: joi.string(),
        hasGroupStage: joi.boolean().default(false),
        knockoutLegs: joi.number().integer().default(1)
      }),
      failAction: async (request, h, error) => {
        return h.view('dream-league/create-cup', { error, cup: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/cup/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/cups')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/cup/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await api.get(`/dream-league/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('dream-league/edit-cup', { cup })
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/edit',
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
        return h.view('dream-league/edit-cup', { cup: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/cup/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/cups')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/cup/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await api.get(`/dream-league/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('dream-league/delete-cup', { cup })
  }
}, {
  method: 'POST',
  path: '/dream-league/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const cup = await api.get(`/dream-league/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
        return h.view('dream-league/delete-cup', { cup, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/cup/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/cups')
    }
  }
}]
