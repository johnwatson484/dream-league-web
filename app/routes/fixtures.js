const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/fixtures',
  options: {
    plugins: {
      crumb: false
    },
    handler: async (request, h) => {
      const fixtures = await get('/fixtures', request.state.dl_token)
      return h.view('fixtures', { fixtures })
    }
  }
}, {
  method: GET,
  path: '/fixture/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const gameweeks = await get('/gameweeks', request.state.dl_token)
    const cups = await get('/cups', request.state.dl_token)
    const managers = await get('/managers', request.state.dl_token)
    return h.view('create-fixture', { gameweeks, cups, managers })
  }
}, {
  method: POST,
  path: '/fixture/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        const gameweeks = await get('/gameweeks', request.state.dl_token)
        const cups = await get('/cups', request.state.dl_token)
        const managers = await get('/managers', request.state.dl_token)
        return h.view('create-fixture', { error, fixture: request.payload, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/fixture/create', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}, {
  method: GET,
  path: '/fixture/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    const gameweeks = await get('/gameweeks', request.state.dl_token)
    const cups = await get('/cups', request.state.dl_token)
    const managers = await get('/managers', request.state.dl_token)
    return h.view('edit-fixture', { fixture, gameweeks, cups, managers })
  }
}, {
  method: POST,
  path: '/fixture/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().integer().required(),
        cupId: Joi.number().integer().required(),
        gameweekId: Joi.number().integer().required(),
        homeManagerId: Joi.number().integer().required(),
        awayManagerId: Joi.number().integer().required(),
        round: Joi.number().integer().required()
      }),
      failAction: async (request, h, error) => {
        const gameweeks = await get('/gameweeks', request.state.dl_token)
        const cups = await get('/cups', request.state.dl_token)
        const managers = await get('/managers', request.state.dl_token)
        return h.view('edit-fixture', { fixture: request.payload, error, gameweeks, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/fixture/edit', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}, {
  method: GET,
  path: '/fixture/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const fixture = await get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
    return h.view('delete-fixture', { fixture })
  }
}, {
  method: POST,
  path: '/fixture/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        fixtureId: Joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const fixture = await get(`/fixture/?fixtureId=${request.query.fixtureId}`, request.state.dl_token)
        return h.view('delete-fixture', { fixture, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/fixture/delete', request.payload, request.state.dl_token)
      return h.redirect('/fixtures')
    }
  }
}]
