const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/groups',
  options: {
    handler: async (request, h) => {
      const groups = await api.get('/dream-league/groups', request.state.dl_token)
      return h.view('dream-league/groups', { groups })
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/group/create',
  handler: async (request, h) => {
    const cups = await api.get('/dream-league/cups', request.state.dl_token)
    const managers = await api.get('/dream-league/managers', request.state.dl_token)
    return h.view('dream-league/create-group', { cups, managers })
  }
}, {
  method: 'POST',
  path: '/dream-league/group/create',
  options: {
    validate: {
      payload: joi.object({
        cupId: joi.number().required(),
        name: joi.string(),
        groupLegs: joi.number(),
        teamsAdvancing: joi.number(),
        managers: joi.array().items(joi.number()).single()
      }),
      failAction: async (request, h, error) => {
        const cups = await api.get('/dream-league/cups', request.state.dl_token)
        const managers = await api.get('/dream-league/managers', request.state.dl_token)
        return h.view('dream-league/create-group', { error, group: request.payload, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/group/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/groups')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/group/edit',
  handler: async (request, h) => {
    const group = await api.get(`/dream-league/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    const cups = await api.get('/dream-league/cups', request.state.dl_token)
    const managers = await api.get('/dream-league/managers', request.state.dl_token)
    return h.view('dream-league/edit-group', { group, cups, managers })
  }
}, {
  method: 'POST',
  path: '/dream-league/group/edit',
  options: {
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
        const cups = await api.get('/dream-league/cups', request.state.dl_token)
        const managers = await api.get('/dream-league/managers', request.state.dl_token)
        return h.view('dream-league/edit-group', { group: request.payload, error, cups, managers }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/group/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/groups')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/group/delete',
  handler: async (request, h) => {
    const group = await api.get(`/dream-league/group/?groupId=${request.query.groupId}`, request.state.dl_token)
    return h.view('dream-league/delete-group', { group })
  }
}, {
  method: 'POST',
  path: '/dream-league/group/delete',
  options: {
    validate: {
      payload: joi.object({
        groupId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const group = await api.get(`/dream-league/group/?groupId=${request.query.groupId}`, request.state.dl_token)
        return h.view('dream-league/delete-group', { group, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/group/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/groups')
    }
  }
}]
