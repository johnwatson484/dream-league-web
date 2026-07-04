import joi from 'joi'
import boom from '@hapi/boom'
import { refreshTeamsheet } from '../refresh/teamsheet/refresh.ts'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'
import ViewModel from './models/teamsheet.ts'
import { GET, POST } from '../constants/verbs.ts'
import Joi from 'joi'

export default [{
  method: GET,
  path: '/teamsheet',
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request.state.dl_token)
    return h.view('teamsheet', { teamsheet })
  },
}, {
  method: GET,
  path: '/teamsheet/edit',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const teamsheet = await get('/teamsheet', request.state.dl_token)
    const teamsheetViewModel = ViewModel(teamsheet)
    return h.view('teamsheet-edit', { teamsheet: teamsheetViewModel })
  },
}, {
  method: POST,
  path: '/teamsheet/edit/player',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        managerId: joi.number().integer(),
        playerIds: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
        playerSubs: joi.alternatives().try(joi.array().items(joi.number().integer()), joi.number().integer()),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/player', request.payload, request.state.dl_token)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/edit/keeper',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    plugins: { crumb: false },
    validate: {
      payload: {
        managerId: joi.number().integer(),
        teamIds: joi.alternatives().try(joi.array().items(joi.string()), joi.string()),
        teamSubs: joi.alternatives().try(joi.array().items(joi.string()), joi.string()),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error)
      },
    },
    handler: async (request, _h) => {
      return post('/teamsheet/edit/keeper', request.payload, request.state.dl_token)
    },
  },
}, {
  method: POST,
  path: '/teamsheet/refresh',
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
      failAction: async (_request, h, error) => {
        return h.view('teamsheet-edit', { message: 'Only .xlsx files are permitted' }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const response = await refreshTeamsheet(request.payload.teamFile.path, request.state.dl_token)
      if (response.success) {
        return h.redirect('/teamsheet/edit')
      }
      return h.view('teamsheet', {
        message: 'Some players could not be mapped',
      })
    },
  },
}]
