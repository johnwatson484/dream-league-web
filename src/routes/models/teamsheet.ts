interface Keeper {
  teamId: number
}

interface Player {
  playerId: number
}

interface Team {
  managerId: number
  name: string
  keepers: Keeper[]
  players: Player[]
}

interface ViewModelTeam {
  managerId: number
  name: string
  keepers: Keeper[]
  players: Player[]
}

function ViewModel (teamsheet: Team[]): ViewModelTeam[] {
  return teamsheet.map(mapTeam)
}

function mapTeam (team: Team): ViewModelTeam {
  const keepers: Keeper[] = []
  const players: Player[] = []
  for (let i = 0; i < 2; i++) {
    keepers[i] = team.keepers[i] ?? { teamId: 0 }
  }
  for (let i = 0; i < 13; i++) {
    players[i] = team.players[i] ?? { playerId: 0 }
  }
  return {
    managerId: team.managerId,
    name: team.name,
    keepers,
    players,
  }
}

export default ViewModel
