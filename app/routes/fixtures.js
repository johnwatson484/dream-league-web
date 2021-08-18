const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/fixtures',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const fixtures = await api.get('/fixtures', request.state.dl_token)
      return h.view('fixtures', { fixtures })
    }
  }
}, {
  method: 'GET',
  path: '/fixture/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const gameweeks = await api.get('/gameweeks', request.state.dl_token)
    const cups = await api.get('/cups', request.state.dl_token)
    const managers = await api.get('/managers', request.state.dl_token)
    return h.view('create-fixture', { gameweeks, cups, managers })
  }
}, {
  method: 'POST',
  path: '/fixture/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().integer().required(),
        gameweekId: joi.number().integer().required(),
        homeManagerId: joi.number().integer().required(),
        awayManagerId: joi.number().integer().required(),
        round: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        const gameweeks = await api.get('/gameweeks', request.state.dl_token)
        const cups = await api.get('/cups', request.state.dl_token)
        const managers = await api.get('/managers', request.state.dl_token)
        return h.view('create-fixture', { error, fixture: request.payload, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/fixture/create', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}, {
  method: 'GET',
  path: '/fixture/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await api.get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    const gameweeks = await api.get('/gameweeks', request.state.dl_token)
    const cups = await api.get('/cups', request.state.dl_token)
    const managers = await api.get('/managers', request.state.dl_token)
    return h.view('edit-fixture', { fixture, gameweeks, cups, managers })
  }
}, {
  method: 'POST',
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        fixtureId: joi.number().integer().required(),
        cupId: joi.number().integer().required(),
        gameweekId: joi.number().integer().required(),
        homeManagerId: joi.number().integer().required(),
        awayManagerId: joi.number().integer().required(),
        round: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        const gameweeks = await api.get('/gameweeks', request.state.dl_token)
        const cups = await api.get('/cups', request.state.dl_token)
        const managers = await api.get('/managers', request.state.dl_token)
        return h.view('edit-fixture', { fixture: request.payload, error, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/fixture/edit', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}, {
  method: 'GET',
  path: '/fixture/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await api.get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    return h.view('delete-fixture', { fixture })
  }
}, {
  method: 'POST',
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        fixtureId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const fixture = await api.get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
        return h.view('delete-fixture', { fixture, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/fixture/delete', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}]
