const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/history',
  handler: async (request, h) => {
    const history = await api.get('/history', request.state.dl_token)
    return h.view('history', { history })
  }
}, {
  method: 'GET',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  path: '/history/create',
  handler: async (_request, h) => {
    return h.view('create-history')
  }
}, {
  method: 'POST',
  path: '/history/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        year: joi.number().required(),
        teams: joi.number(),
        league1: joi.string().allow(''),
        league2: joi.string().allow(''),
        cup: joi.string().allow(''),
        leagueCup: joi.string().allow(''),
        plate: joi.string().allow('')
      }),
      failAction: async (request, h, error) => {
        return h.view('create-history', { error, history: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/history/create', request.payload, request.state.dl_token)
      return h.redirect('/history')
    }
  }
}, {
  method: 'GET',
  path: '/history/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const history = await api.get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('edit-history', { history })
  }
}, {
  method: 'POST',
  path: '/history/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        historyId: joi.number().required(),
        year: joi.number().required(),
        teams: joi.number(),
        league1: joi.string().allow(''),
        league2: joi.string().allow(''),
        cup: joi.string().allow(''),
        leagueCup: joi.string().allow(''),
        plate: joi.string().allow('')
      }),
      failAction: async (request, h, error) => {
        return h.view('league/edit-history', { history: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/history/edit', request.payload, request.state.dl_token)
      return h.redirect('/history')
    }
  }
}, {
  method: 'GET',
  path: '/history/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const history = await api.get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('delete-history', { history })
  }
}, {
  method: 'POST',
  path: '/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        historyId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const history = await api.get(`/history/?historyId=${request.query.historyId}`, request.state.dl_token)
        return h.view('delete-history', { history, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/history/delete', request.payload, request.state.dl_token)
      return h.redirect('/history')
    }
  }
}]
