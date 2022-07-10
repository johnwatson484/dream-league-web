const api = require('../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/meetings',
  handler: async (request, h) => {
    const meetings = await api.get('/meetings', request.state.dl_token)
    return h.view('meetings', { meetings })
  }
}, {
  method: 'GET',
  path: '/meeting/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (_request, h) => {
    return h.view('create-meeting')
  }
}, {
  method: 'POST',
  path: '/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        date: joi.date()
      }),
      failAction: async (request, h, error) => {
        return h.view('create-meeting', { error, meeting: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/meeting/create', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    }
  }
}, {
  method: 'GET',
  path: '/meeting/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await api.get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('edit-meeting', { meeting })
  }
}, {
  method: 'POST',
  path: '/meeting/edit',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        meetingId: joi.number().required(),
        date: joi.date()
      }),
      failAction: async (request, h, error) => {
        return h.view('league/edit-meeting', { meeting: request.payload, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/meeting/edit', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    }
  }
}, {
  method: 'GET',
  path: '/meeting/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await api.get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('delete-meeting', { meeting })
  }
}, {
  method: 'POST',
  path: '/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        meetingId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const meeting = await api.get(`/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
        return h.view('delete-meeting', { meeting, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/meeting/delete', request.payload, request.state.dl_token)
      return h.redirect('/meetings')
    }
  }
}]
