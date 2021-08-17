function ViewModel (teamsheet) {
  const teams = teamsheet.map(mapTeam)
  return teams
}

const mapTeam = (team) => {
  const keepers = []
  const players = []
  for (let i = 0; i < 2; i++) {
    keepers[i] = team.keepers[i] ? team.keepers[i] : { teamId: 0 }
  }
  for (let i = 0; i < 13; i++) {
    players[i] = team.players[i] ? team.players[i] : { playerId: 0 }
  }
  return {
    managerId: team.managerId,
    name: team.name,
    keepers,
    players
  }
}

module.exports = ViewModel
