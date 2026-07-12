import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { refreshPlayers } from '../../refresh/players/refresh.ts'
import { get } from '../../api/get.ts'
import { post } from '../../api/post.ts'

const { HTTP_STATUS_BAD_REQUEST } = httpConstants

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
        return h.view('league/refresh', { message: 'Only .xlsx files are permitted' }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as { playerFile: { path: string } }
      const response = await refreshPlayers(payload.playerFile.path, request) as { mappedPlayers: any[]; unmappedTeams: any[] }

      if (!response.mappedPlayers && !response.unmappedTeams) {
        return h.view('league/refresh', { message: 'Invalid players list' })
      }

      if (!response.unmappedTeams.length) {
        await post('/league/players/refresh/confirm', { players: response.mappedPlayers }, request)
        return h.redirect('/league/players')
      }

      const teams = await get('/league/teams', request) as any[]
      return h.view('league/refresh-review', {
        mappedPlayers: response.mappedPlayers,
        unmappedTeams: response.unmappedTeams,
        teams,
        previewJson: JSON.stringify(response),
      })
    },
  },
}, {
  method: 'POST',
  path: '/league/refresh/players/confirm',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: Joi.object({
        players: Joi.array().items(Joi.object({
          firstName: Joi.string().allow('', null),
          lastName: Joi.string().allow('', null),
          position: Joi.string().required(),
          teamId: Joi.number().integer().required(),
        })),
      }),
      failAction: async (_request, h, _error) => {
        return h.response({ success: false, message: 'Invalid payload' }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      const result = await post('/league/players/refresh/confirm', request.payload, request) as object
      return h.response(result)
    },
  },
}]

export default routes
