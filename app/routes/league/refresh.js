const Joi = require('joi')
const { refreshPlayers } = require('../../refresh')
const { GET, POST } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/league/refresh',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: (_request, h) => {
    return h.view('league/refresh')
  },
}, {
  method: POST,
  path: '/league/refresh/players',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false,
    },
    validate: {
      payload: {
        playerFile: Joi.object({
          headers: Joi.object({
            'content-type': Joi.string().valid('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
          }).unknown(),
          filename: Joi.string().required().custom((value, helpers) => {
            if (!value.endsWith('.xlsx')) {
              return helpers.error('any.invalid', { message: 'Only .xlsx files are permitted' })
            }
            return value
          }),
        }).unknown(),
      },
      failAction: async (_request, h, error) => {
        return h.view('league/refresh', { message: 'Only .xlsx files are permitted' }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const response = await refreshPlayers(request.payload.playerFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/league/players')
      }

      if (response.unmappedPlayers) {
        return h.view('league/refresh', {
          message: 'Some players could not be mapped',
          unmappedPlayers: response.unmappedPlayers,
        })
      }

      return h.view('league/refresh', { message: 'Invalid players list' })
    },
  },
}]
