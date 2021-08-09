const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/history',
  handler: async (request, h) => {
    const history = await api.get('/dream-league/history', request.state.dl_token)
    return h.view('dream-league/history', { history })
  }
}, {
  method: 'GET',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  path: '/dream-league/history/create',
  handler: async (request, h) => {
    return h.view('dream-league/create-history')
  }
}, {
  method: 'POST',
  path: '/dream-league/history/create',
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
        return h.view('dream-league/create-history', { error, history: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/history/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/history')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/history/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const history = await api.get(`/dream-league/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('dream-league/edit-history', { history })
  }
}, {
  method: 'POST',
  path: '/dream-league/history/edit',
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
      await api.post('/dream-league/history/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/history')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/history/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const history = await api.get(`/dream-league/history/?historyId=${request.query.historyId}`, request.state.dl_token)
    return h.view('dream-league/delete-history', { history })
  }
}, {
  method: 'POST',
  path: '/dream-league/history/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        historyId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const history = await api.get(`/dream-league/history/?historyId=${request.query.historyId}`, request.state.dl_token)
        return h.view('dream-league/delete-history', { history, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/history/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/history')
    }
  }
}]
