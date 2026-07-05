import type { ServerRoute } from '@hapi/hapi'
import { get } from '../../api/get.ts'
import { GET } from '../../constants/verbs.ts'

interface TeamsheetTeam {
  name: string
  players: { playerId: number; lastNameFirstName: string; position: string; team: string; substitute: boolean }[]
  keepers: { teamId: number; name: string; substitute: boolean }[]
}

function formatTeamsheet (teamsheet: TeamsheetTeam[]): { data: { players: unknown[]; goalkeepers: unknown[] } } {
  const players: unknown[] = []
  const goalkeepers: unknown[] = []
  for (const team of teamsheet) {
    for (const player of team.players) {
      players.push({
        playerId: player.playerId,
        name: player.lastNameFirstName,
        position: player.position,
        team: player.team,
        manager: team.name,
        substitute: player.substitute,
      })
    }
    for (const keeper of team.keepers) {
      goalkeepers.push({
        teamId: keeper.teamId,
        name: keeper.name,
        manager: team.name,
        substitute: keeper.substitute,
      })
    }
  }

  return {
    data: {
      players,
      goalkeepers,
    },
  }
}

const routes: ServerRoute[] = [{
  method: GET,
  path: '/api/v1/manager/teams',
  options: {
    handler: async (request, h) => {
      const teamsheet = await get('/teamsheet', request) as TeamsheetTeam[]
      const formattedTeamsheet = formatTeamsheet(teamsheet)
      return h.response(formattedTeamsheet)
    },
  },
}]

export default routes
