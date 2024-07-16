const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/groups',
  options: {
    handler: async (request, h) => {
      const groups = await get('/groups', request.state.dl_token)
      return h.view('groups', { groups })
    },
  },
}, {
  method: GET,
  path: '/group/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cups = await get('/cups', request.state.dl_token)
    const managers = await get('/managers', request.state.dl_token)
    return h.view('create-group', { cups, managers })
  },
}, {
  method: POST,
  path: '/group/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single(),
      }),
      failAction: async (request, h, error) => {
        const cups = await get('/cups', request.state.dl_token)
        const managers = await get('/managers', request.state.dl_token)
        return h.view('create-group', { error, group: request.payload, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/create', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    },
  },
}, {
  method: GET,
  path: '/group/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const group = await get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    const cups = await get('/cups', request.state.dl_token)
    const managers = await get('/managers', request.state.dl_token)
    return h.view('edit-group', { group, cups, managers })
  },
}, {
  method: POST,
  path: '/group/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        groupId: Joi.number().integer().required(),
        cupId: Joi.number().required(),
        name: Joi.string(),
        groupLegs: Joi.number(),
        teamsAdvancing: Joi.number(),
        managers: Joi.array().items(Joi.number()).single(),
      }),
      failAction: async (request, h, error) => {
        const cups = await get('/cups', request.state.dl_token)
        const managers = await get('/managers', request.state.dl_token)
        return h.view('edit-group', { group: request.payload, error, cups, managers }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/edit', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    },
  },
}, {
  method: GET,
  path: '/group/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const group = await get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    return h.view('delete-group', { group })
  },
}, {
  method: POST,
  path: '/group/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        groupId: Joi.number().required(),
      }),
      failAction: async (request, h, error) => {
        const group = await get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
        return h.view('delete-group', { group, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/group/delete', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    },
  },
}]
