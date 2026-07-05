import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { refreshTeamsheet } from '../refresh/teamsheet/refresh.ts'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import ViewModel from './models/teamsheet.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/teamsheet',
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request)
    return h.view('teamsheet', { teamsheet })
  },
}, {
  method: 'GET',
  path: '/teamsheet/edit',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request) as { managerId: number; name: string; keepers: { teamId: number }[]; players: { playerId: number }[] }[]
    const teamsheetViewModel = ViewModel(teamsheet)
    return h.view('teamsheet-edit', { teamsheet: teamsheetViewModel })
  },
}, {
  method: 'POST',
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        managerId: Joi.number().integer(),
        playerIds: Joi.alternatives().try(Joi.array().items(Joi.number().integer()), Joi.number().integer()),
        playerSubs: Joi.alternatives().try(Joi.array().items(Joi.number().integer()), Joi.number().integer()),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/player', request.payload, request)
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        managerId: Joi.number().integer(),
        teamIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        teamSubs: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/keeper', request.payload, request)
    },
  },
}, {
  method: 'POST',
  path: '/teamsheet/refresh',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
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
        teamFile: Joi.object({
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
        return h.view('teamsheet-edit', { message: 'Only .xlsx files are permitted' }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as { teamFile: { path: string } }
      const response = await refreshTeamsheet(payload.teamFile.path, request) as { success: boolean }
      if (response.success) {
        return h.redirect('/teamsheet/edit')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped',
      })
    },
  },
}]

export default routes
