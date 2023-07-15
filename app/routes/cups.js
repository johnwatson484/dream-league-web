const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/cups',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const cups = await get('/cups', request.state.dl_token)
      return h.view('cups', { cups })
    }
  }
}, {
  method: GET,
  path: '/cup/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-cup')
  }
}, {
  method: POST,
  path: '/cup/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        hasGroupStage: Joi.boolean().default(false),
        knockoutLegs: Joi.number().integer().default(1)
      }),
      failAction: async (request, h, error) => {
        return h.view('create-cup', { error, cup: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/cup/create', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}, {
  method: GET,
  path: '/cup/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('edit-cup', { cup })
  }
}, {
  method: POST,
  path: '/cup/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().integer().required(),
        name: Joi.string(),
        hasGroupStage: Joi.boolean().required(),
        knockoutLegs: Joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('edit-cup', { cup: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/cup/edit', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}, {
  method: GET,
  path: '/cup/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cup = await get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
    return h.view('delete-cup', { cup })
  }
}, {
  method: POST,
  path: '/cup/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const cup = await get(`/cup/?cupId=${request.query.cupId}`, request.state.dl_token)
        return h.view('delete-cup', { cup, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/cup/delete', request.payload, request.state.dl_token)
      return h.redirect('/cups')
    }
  }
}]
