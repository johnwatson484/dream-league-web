interface Scorer {
  playerId: number
  name: string
  goals: number
}

interface Manager {
  managerId: number
  name: string
}

interface ManagerSummary {
  managerId: number
  manager: string
  goals: number
  conceded: number
  scorers: Scorer[]
}

interface LiveSummary {
  managers?: ManagerSummary[]
}

export interface LiveScore {
  managerId: number
  manager: string
  goals: number
  conceded: number
  result: string
  scorers: Scorer[]
}

export function getResult (goals: number, conceded: number): string {
  if (goals > conceded) { return 'W' }
  if (goals < conceded) { return 'L' }
  return 'D'
}

export function sortScores (scores: LiveScore[]): LiveScore[] {
  return scores.sort((a, b) =>
    b.goals - a.goals ||
    a.conceded - b.conceded ||
    a.manager.localeCompare(b.manager))
}

export function buildLiveScores (managers: Manager[] = [], liveSummary: LiveSummary | null = null): LiveScore[] {
  const summaries = new Map<number, ManagerSummary>()
  for (const summary of liveSummary?.managers ?? []) {
    summaries.set(summary.managerId, summary)
  }

  const scores = managers.map(manager => {
    const summary = summaries.get(manager.managerId)
    const goals = summary?.goals ?? 0
    const conceded = summary?.conceded ?? 0
    return {
      managerId: manager.managerId,
      manager: manager.name,
      goals,
      conceded,
      result: getResult(goals, conceded),
      scorers: summary?.scorers ?? [],
    }
  })

  return sortScores(scores)
}

export default buildLiveScores
