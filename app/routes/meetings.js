const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/meetings',
  handler: async (request, h) => {
    const meetings = await get('/meetings', request.state.dl_token)
    return h.view('meetings', { meetings })
  },
}, {
  method: GET,
  path: '/meeting/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-meeting')
  },
}, {
  method: POST,
  path: '/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        date: Joi.date(),
      },
      failAction: async (request, h, error) => {
        return h.view('create-meeting', { error, meeting: request.payload }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/create', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    },
  },
}, {
  method: GET,
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      query: {
        meetingId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        return h.view('404').code(404).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const meeting = await get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('edit-meeting', { meeting })
  },
}, {
  method: POST,
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        meetingId: Joi.number().integer().required(),
        date: Joi.date(),
      },
      failAction: async (request, h, error) => {
        return h.view('league/edit-meeting', { meeting: request.payload, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/edit', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    },
  },
}, {
  method: GET,
  path: '/meeting/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('delete-meeting', { meeting })
  },
}, {
  method: POST,
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: {
        meetingId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const meeting = await get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
        return h.view('delete-meeting', { meeting, error }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/meeting/delete', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    },
  },
}]
