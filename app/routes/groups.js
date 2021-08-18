const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/groups',
  options: {
    handler: async (request, h) => {
      const groups = await api.get('/groups', request.state.dl_token)
      return h.view('groups', { groups })
    }
  }
}, {
  method: 'GET',
  path: '/group/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const cups = await api.get('/cups', request.state.dl_token)
    const managers = await api.get('/managers', request.state.dl_token)
    return h.view('create-group', { cups, managers })
  }
}, {
  method: 'POST',
  path: '/group/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        cupId: joi.number().required(),
        name: joi.string(),
        groupLegs: joi.number(),
        teamsAdvancing: joi.number(),
        managers: joi.array().items(joi.number()).single()
      }),
      failAction: async (request, h, error) => {
        const cups = await api.get('/cups', request.state.dl_token)
        const managers = await api.get('/managers', request.state.dl_token)
        return h.view('create-group', { error, group: request.payload, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/group/create', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    }
  }
}, {
  method: 'GET',
  path: '/group/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const group = await api.get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    const cups = await api.get('/cups', request.state.dl_token)
    const managers = await api.get('/managers', request.state.dl_token)
    return h.view('edit-group', { group, cups, managers })
  }
}, {
  method: 'POST',
  path: '/group/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        groupId: joi.number().integer().required(),
        cupId: joi.number().required(),
        name: joi.string(),
        groupLegs: joi.number(),
        teamsAdvancing: joi.number(),
        managers: joi.array().items(joi.number()).single()
      }),
      failAction: async (request, h, error) => {
        const cups = await api.get('/cups', request.state.dl_token)
        const managers = await api.get('/managers', request.state.dl_token)
        return h.view('edit-group', { group: request.payload, error, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/group/edit', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    }
  }
}, {
  method: 'GET',
  path: '/group/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const group = await api.get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    return h.view('delete-group', { group })
  }
}, {
  method: 'POST',
  path: '/group/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        groupId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const group = await api.get(`/group/?groupId=${request.query.groupId}`, request.state.dl_token)
        return h.view('delete-group', { group, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/group/delete', request.payload, request.state.dl_token)
      return h.redirect('/groups')
    }
  }
}]
