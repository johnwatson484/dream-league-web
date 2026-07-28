interface Scorer {
  playerId: number
  name: string
  goals: number
}

interface Winner {
  gameweek: number
  name: string
  managerId: number
  goals: number
  conceded: number
  margin: number
  result: string
  scorers: Scorer[]
}

interface WeeklyWinners {
  gameweek: number
  winners: Winner[]
}

function groupWinnersByGameweek (winners: Winner[]): WeeklyWinners[] {
  const grouped = new Map<number, Winner[]>()
  for (const winner of winners) {
    if (!grouped.has(winner.gameweek)) {
      grouped.set(winner.gameweek, [])
    }
    grouped.get(winner.gameweek)!.push(winner)
  }
  return [...grouped.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([gameweek, winners]) => ({ gameweek, winners }))
}

export default groupWinnersByGameweek
