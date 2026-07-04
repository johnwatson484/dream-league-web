import { get } from '../../api/get.ts'
import { GET } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/api/v1/manager/teams',
  options: {
    handler: async (request, h) => {
      const teamsheet = await get('/teamsheet', request)
      const formattedTeamsheet = formatTeamsheet(teamsheet)
      return h.response(formattedTeamsheet)
    },
  },
}]

function formatTeamsheet (teamsheet) {
  const players = []
  const goalkeepers = []
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
