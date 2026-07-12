import { constants as httpConstants } from 'node:http2'
import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../../api/get.ts'
import { post } from '../../api/post.ts'
import { buildUrl } from '../../api/build-url.ts'
import { DEFENDER, MIDFIELDER, FORWARD } from '../../constants/positions.ts'

const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } = httpConstants
const positions = [DEFENDER, MIDFIELDER, FORWARD]

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/league/players',
  options: {
    validate: {
      query: {
        search: Joi.string().allow(''),
        position: Joi.string().allow(''),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const query = request.query as Record<string, string>
    const search = query.search || ''
    const position = query.position || ''
    const players = await get(buildUrl('/league/players', { search, position }), request)
    return h.view('league/players', { players, positions, currentPosition: position, currentSearch: search })
  },
}, {
  method: 'GET',
  path: '/league/player/detail',
  options: {
    validate: {
      query: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const player = await get(`/league/player?playerId=${(request.query as Record<string, unknown>).playerId}`, request) as { goals?: { cup: boolean }[] }

    const leagueGoals = player.goals ? player.goals.filter(g => !g.cup).length : 0
    const cupGoals = player.goals ? player.goals.filter(g => g.cup).length : 0

    return h.view('league/player-detail', { player, leagueGoals, cupGoals })
  },
}, {
  method: 'GET',
  path: '/league/player/create',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const teams = await get('/league/teams', request)
    return h.view('league/create-player', { teams, positions })
  },
}, {
  method: 'POST',
  path: '/league/player/create',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        firstName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        position: Joi.string().valid(...positions),
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const teams = await get('/league/teams', request)
        return h.view('league/create-player', { teams, positions, error, player: request.payload }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/create', request.payload, request)
      return h.redirect('/league/players')
    },
  },
}, {
  method: 'GET',
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const player = await get(`/league/player/?playerId=${(request.query as Record<string, unknown>).playerId}`, request)
    const teams = await get('/league/teams', request)
    return h.view('league/edit-player', { player, teams, positions })
  },
}, {
  method: 'POST',
  path: '/league/player/edit',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        playerId: Joi.number().integer().required(),
        firstName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        position: Joi.string().valid(...positions),
        teamId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const teams = await get('/league/teams', request)
        return h.view('league/edit-player', { player: request.payload, teams, positions, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/edit', request.payload, request)
      return h.redirect('/league/players')
    },
  },
}, {
  method: 'GET',
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      query: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (_request, h, _error) => {
        return h.view('404').code(HTTP_STATUS_NOT_FOUND).takeover()
      },
    },
  },
  handler: async (request, h) => {
    const player = await get(`/league/player/?playerId=${(request.query as Record<string, unknown>).playerId}`, request)
    return h.view('league/delete-player', { player })
  },
}, {
  method: 'POST',
  path: '/league/player/delete',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: {
        playerId: Joi.number().integer().required(),
      },
      failAction: async (request, h, error) => {
        const player = await get(`/league/player/?playerId=${(request.query as Record<string, unknown>).playerId}`, request)
        return h.view('league/delete-player', { player, error }).code(HTTP_STATUS_BAD_REQUEST).takeover()
      },
    },
    handler: async (request, h) => {
      await post('/league/player/delete', request.payload, request)
      return h.redirect('/league/players')
    },
  },
}, {
  method: 'POST',
  path: '/league/players/autocomplete',
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
      const players = await post('/league/players/autocomplete', request.payload, request) as { lastNameFirstName: string; team: { name: string }; position: string; playerId: number }[]
      return players.map(function (player) {
        return {
          label: `${player.lastNameFirstName} - ${player.team.name} - ${player.position}`,
          val: player.playerId,
        }
      })
    },
  },
}]

export default routes
