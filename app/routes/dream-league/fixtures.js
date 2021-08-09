const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/fixtures',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const fixtures = await api.get('/dream-league/fixtures', request.state.dl_token)
      return h.view('dream-league/fixtures', { fixtures })
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/fixture/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const gameweeks = await api.get('/dream-league/gameweeks', request.state.dl_token)
    const cups = await api.get('/dream-league/cups', request.state.dl_token)
    const managers = await api.get('/dream-league/managers', request.state.dl_token)
    return h.view('dream-league/create-fixture', { gameweeks, cups, managers })
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/create',
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
        const gameweeks = await api.get('/dream-league/gameweeks', request.state.dl_token)
        const cups = await api.get('/dream-league/cups', request.state.dl_token)
        const managers = await api.get('/dream-league/managers', request.state.dl_token)
        return h.view('dream-league/create-fixture', { error, fixture: request.payload, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/fixture/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/fixtures')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/fixture/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await api.get(`/dream-league/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    const gameweeks = await api.get('/dream-league/gameweeks', request.state.dl_token)
    const cups = await api.get('/dream-league/cups', request.state.dl_token)
    const managers = await api.get('/dream-league/managers', request.state.dl_token)
    return h.view('dream-league/edit-fixture', { fixture, gameweeks, cups, managers })
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/edit',
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
        const gameweeks = await api.get('/dream-league/gameweeks', request.state.dl_token)
        const cups = await api.get('/dream-league/cups', request.state.dl_token)
        const managers = await api.get('/dream-league/managers', request.state.dl_token)
        return h.view('dream-league/edit-fixture', { fixture: request.payload, error, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/fixture/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/fixtures')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/fixture/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await api.get(`/dream-league/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    return h.view('dream-league/delete-fixture', { fixture })
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        fixtureId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const fixture = await api.get(`/dream-league/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
        return h.view('dream-league/delete-fixture', { fixture, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/fixture/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/fixtures')
    }
  }
}]
