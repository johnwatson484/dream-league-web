import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { refreshPlayers } from '../../refresh/players/refresh.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/league/refresh',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: (_request, h) => {
    return h.view('league/refresh')
  },
}, {
  method: 'POST',
  path: '/league/refresh/players',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    payload: {
      maxBytes: 10485760,
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
      failAction: async (_request, h, _error) => {
        return h.view('league/refresh', { message: 'Only .xlsx files are permitted' }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as { playerFile: { path: string } }
      const response = await refreshPlayers(payload.playerFile.path, request) as { success: boolean; unmappedPlayers?: unknown[] }
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

export default routes
