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
      console.log(fixtures)
      return h.view('dream-league/fixtures', { fixtures })
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/fixture/create',
  handler: async (request, h) => {
    return h.view('dream-league/create-fixture')
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/create',
  options: {
    validate: {
      payload: joi.object({
        cupId: joi.number().integer().required(),
        gameweekId: joi.number().integer().required(),
        homeManagerId: joi.number().integer().required(),
        awayManagerId: joi.number().integer().required(),
        round: joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('dream-league/create-fixture', { error, fixture: request.payload }).code(400).takeover()
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
  handler: async (request, h) => {
    const fixture = await api.get(`/dream-league/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    return h.view('dream-league/edit-fixture', { fixture })
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/edit',
  options: {
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
        return h.view('dream-league/edit-fixture', { fixture: request.payload, error }).code(400).takeover()
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
  handler: async (request, h) => {
    const fixture = await api.get(`/dream-league/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    return h.view('dream-league/delete-fixture', { fixture })
  }
}, {
  method: 'POST',
  path: '/dream-league/fixture/delete',
  options: {
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
