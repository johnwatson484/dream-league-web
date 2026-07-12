import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../../api/get.ts'
import { post } from '../../api/post.ts'
import { buildUrl } from '../../api/build-url.ts'

const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } = httpConstants

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/league/teams',
  options: {
    validate: {
      query: {
        search: Joi.string().allow(''),
        division: Joi.string().allow(''),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const query = request.query as Record<string, string>
    const search = query.search || ''
    const division = query.division || ''
    const teams = await get(buildUrl('/league/teams', { search, division }), request)
    const divisions = await get('/league/divisions', request)
    return h.view('league/teams', { teams, divisions, currentDivision: division, currentSearch: search })
  },
}, {
  method: 'GET',
  path: '/league/team/detail',
  options: {
    validate: {
      query: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const team = await get(`/league/team?teamId=${(request.query as Record<string, unknown>).teamId}`, request)
    return h.view('league/team-detail', { team })
  },
}, {
  method: 'GET',
  path: '/league/team/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const divisions = await get('/league/divisions', request)
    return h.view('league/create-team', { divisions })
  },
}, {
  method: 'POST',
  path: '/league/team/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        name: Joi.string().required(),
        alias: Joi.string().required(),
        divisionId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const divisions = await get('/league/divisions', request)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/create', request.payload, request)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: 'GET',
  path: '/league/team/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const team = await get(`/league/team/?teamId=${(request.query as Record<string, unknown>).teamId}`, request)
    const divisions = await get('/league/divisions', request)
    return h.view('league/edit-team', { team, divisions })
  },
}, {
  method: 'POST',
  path: '/league/team/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        teamId: Joi.string().required(),
        name: Joi.string().required(),
        alias: Joi.string().required(),
        divisionId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const divisions = await get('/league/divisions', request)
        return h.view('league/create-team', { divisions, team: request.payload, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/edit', request.payload, request)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: 'GET',
  path: '/league/team/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const team = await get(`/league/team/?teamId=${(request.query as Record<string, unknown>).teamId}`, request)
    return h.view('league/delete-team', { team })
  },
}, {
  method: 'POST',
  path: '/league/team/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const team = await get(`/league/player/?playerId=${(request.query as Record<string, unknown>).teamId}`, request)
        return h.view('league/delete-team', { team, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/team/delete', request.payload, request)
      return h.redirect('/league/teams')
    },
  },
}, {
  method: 'POST',
  path: '/league/teams/autocomplete',
  options: {
    plugins: {
      crumb: false,
    },
    validate: {
      payload: {
        prefix: Joi.string(),
      },
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, _h) => {
      const teams = await post('/league/teams/autocomplete', request.payload, request) as { name: string; teamId: number }[]
      return teams.map(function (team) {
        return {
          label: team.name,
          val: team.teamId,
        }
      })
    },
  },
}]

export default routes
