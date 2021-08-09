const api = require('../../api')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/dream-league/meetings',
  handler: async (request, h) => {
    const meetings = await api.get('/dream-league/meetings', request.state.dl_token)
    return h.view('dream-league/meetings', { meetings })
  }
}, {
  method: 'GET',
  path: '/dream-league/meeting/create',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    return h.view('dream-league/create-meeting')
  }
}, {
  method: 'POST',
  path: '/dream-league/meeting/create',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        date: joi.date()
      }),
      failAction: async (request, h, error) => {
        return h.view('dream-league/create-meeting', { error, meeting: request.payload }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/meeting/create', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/meetings')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/meeting/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await api.get(`/dream-league/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('dream-league/edit-meeting', { meeting })
  }
}, {
  method: 'POST',
  path: '/dream-league/meeting/edit',
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
      await api.post('/dream-league/meeting/edit', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/meetings')
    }
  }
}, {
  method: 'GET',
  path: '/dream-league/meeting/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const meeting = await api.get(`/dream-league/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
    return h.view('dream-league/delete-meeting', { meeting })
  }
}, {
  method: 'POST',
  path: '/dream-league/meeting/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: joi.object({
        meetingId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const meeting = await api.get(`/dream-league/meeting/?meetingId=${request.query.meetingId}`, request.state.dl_token)
        return h.view('dream-league/delete-meeting', { meeting, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await api.post('/dream-league/meeting/delete', request.payload, request.state.dl_token)
      return h.redirect('/dream-league/meetings')
    }
  }
}]
