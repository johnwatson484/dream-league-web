import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { get } from '../api/get.ts'
import { post } from '../api/post.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/league/season-setup',
  options: { auth: { strategy: 'session', scope: ['admin'] } },
  handler: async (request, h) => {
    const data = await get('/league/season-setup', request) as { teams: any[]; divisions: any[] }
    const teamsByDivision: Record<string, any[]> = {}
    for (const team of data.teams) {
      const divisionName = team.division?.name || 'Unknown'
      if (!teamsByDivision[divisionName]) {
        teamsByDivision[divisionName] = []
      }
      teamsByDivision[divisionName].push(team)
    }
    return h.view('league/season-setup', {
      teamsByDivision,
      divisions: data.divisions,
      championship: teamsByDivision['Championship'] || [],
      league1: teamsByDivision['League 1'] || [],
      league2: teamsByDivision['League 2'] || [],
    })
  },
}, {
  method: 'POST',
  path: '/league/season-setup',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        newTeamName1: Joi.string().required(),
        newTeamAlias1: Joi.string().required(),
        newTeamName2: Joi.string().required(),
        newTeamAlias2: Joi.string().required(),
        newTeamName3: Joi.string().required(),
        newTeamAlias3: Joi.string().required(),
        promoteFromChampionship1: Joi.number().integer().required(),
        promoteFromChampionship2: Joi.number().integer().required(),
        promoteFromChampionship3: Joi.number().integer().required(),
        relegateFromChampionship1: Joi.number().integer().required(),
        relegateFromChampionship2: Joi.number().integer().required(),
        relegateFromChampionship3: Joi.number().integer().required(),
        promoteFromLeague1_1: Joi.number().integer().required(),
        promoteFromLeague1_2: Joi.number().integer().required(),
        promoteFromLeague1_3: Joi.number().integer().required(),
        relegateFromLeague1_1: Joi.number().integer().required(),
        relegateFromLeague1_2: Joi.number().integer().required(),
        relegateFromLeague1_3: Joi.number().integer().required(),
        relegateFromLeague1_4: Joi.number().integer().required(),
        promoteFromLeague2_1: Joi.number().integer().required(),
        promoteFromLeague2_2: Joi.number().integer().required(),
        promoteFromLeague2_3: Joi.number().integer().required(),
        promoteFromLeague2_4: Joi.number().integer().required(),
        relegateFromLeague2_1: Joi.number().integer().required(),
        relegateFromLeague2_2: Joi.number().integer().required(),
      }),
      failAction: async (request, h, _error) => {
        const data = await get('/league/season-setup', request) as { teams: any[]; divisions: any[] }
        const teamsByDivision: Record<string, any[]> = {}
        for (const team of data.teams) {
          const divisionName = team.division?.name || 'Unknown'
          if (!teamsByDivision[divisionName]) {
            teamsByDivision[divisionName] = []
          }
          teamsByDivision[divisionName].push(team)
        }
        return h.view('league/season-setup', {
          teamsByDivision,
          divisions: data.divisions,
          championship: teamsByDivision['Championship'] || [],
          league1: teamsByDivision['League 1'] || [],
          league2: teamsByDivision['League 2'] || [],
          error: 'All fields are required. Please complete every section.',
        }).code(400).takeover()
      },
    },
    handler: async (request, h) => {
      const payload = request.payload as Record<string, any>

      const data = await get('/league/season-setup', request) as { teams: any[]; divisions: any[] }
      const divisions = data.divisions as any[]
      const championshipDivision = divisions.find((d: any) => d.name === 'Championship')
      const league1Division = divisions.find((d: any) => d.name === 'League 1')
      const league2Division = divisions.find((d: any) => d.name === 'League 2')

      const newTeams = [
        { name: payload.newTeamName1, alias: payload.newTeamAlias1, divisionId: championshipDivision.divisionId },
        { name: payload.newTeamName2, alias: payload.newTeamAlias2, divisionId: championshipDivision.divisionId },
        { name: payload.newTeamName3, alias: payload.newTeamAlias3, divisionId: championshipDivision.divisionId },
      ]

      const moves = [
        { teamId: payload.relegateFromChampionship1, divisionId: league1Division.divisionId },
        { teamId: payload.relegateFromChampionship2, divisionId: league1Division.divisionId },
        { teamId: payload.relegateFromChampionship3, divisionId: league1Division.divisionId },
        { teamId: payload.promoteFromLeague1_1, divisionId: championshipDivision.divisionId },
        { teamId: payload.promoteFromLeague1_2, divisionId: championshipDivision.divisionId },
        { teamId: payload.promoteFromLeague1_3, divisionId: championshipDivision.divisionId },
        { teamId: payload.relegateFromLeague1_1, divisionId: league2Division.divisionId },
        { teamId: payload.relegateFromLeague1_2, divisionId: league2Division.divisionId },
        { teamId: payload.relegateFromLeague1_3, divisionId: league2Division.divisionId },
        { teamId: payload.relegateFromLeague1_4, divisionId: league2Division.divisionId },
        { teamId: payload.promoteFromLeague2_1, divisionId: league1Division.divisionId },
        { teamId: payload.promoteFromLeague2_2, divisionId: league1Division.divisionId },
        { teamId: payload.promoteFromLeague2_3, divisionId: league1Division.divisionId },
        { teamId: payload.promoteFromLeague2_4, divisionId: league1Division.divisionId },
      ]

      const deletes = [
        payload.promoteFromChampionship1,
        payload.promoteFromChampionship2,
        payload.promoteFromChampionship3,
        payload.relegateFromLeague2_1,
        payload.relegateFromLeague2_2,
      ]

      await post('/league/season-setup', { newTeams, moves, deletes }, request)
      return h.redirect('/league/teams')
    },
  },
}]

export default routes
