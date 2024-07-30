const { get } = require('../../api')
const { GET } = require('../../constants/verbs')

module.exports = [{
  method: GET,
  path: '/api/v1/manager/teams',
  options: {
    handler: async (request, h) => {
      const teamsheet = await get('/teamsheet', request.state.dl_token)
      const formattedTeamsheet = formatTeamsheet(teamsheet)
      return h.response(formattedTeamsheet)
    },
  },
}, {
  method: GET,
  path: '/api/data/manager/teams',
  options: {
    handler: async (_request, h) => {
      return h.redirect('/api/v1/manager/teams')
    },
  },
}]

const formatTeamsheet = (teamsheet) => {
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
