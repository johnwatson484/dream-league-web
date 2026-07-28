import groupWinnersByGameweek from '../../src/routes/models/weekly-winners.ts'

describe('weekly winners view model', () => {
  test('groups winners by gameweek', () => {
    const winners = [
      { gameweek: 1, name: 'Alice', managerId: 1, goals: 7, conceded: 2, margin: 5, result: 'W', scorers: [] },
      { gameweek: 1, name: 'Bob', managerId: 2, goals: 7, conceded: 2, margin: 5, result: 'W', scorers: [] },
      { gameweek: 2, name: 'Charlie', managerId: 3, goals: 5, conceded: 3, margin: 2, result: 'W', scorers: [] },
    ]

    const result = groupWinnersByGameweek(winners)

    expect(result).toHaveLength(2)
    expect(result[0]!.winners).toHaveLength(1)
    expect(result[1]!.winners).toHaveLength(2)
  })

  test('sorts gameweeks in descending order', () => {
    const winners = [
      { gameweek: 1, name: 'Alice', managerId: 1, goals: 5, conceded: 2, margin: 3, result: 'W', scorers: [] },
      { gameweek: 3, name: 'Bob', managerId: 2, goals: 6, conceded: 1, margin: 5, result: 'W', scorers: [] },
      { gameweek: 2, name: 'Charlie', managerId: 3, goals: 4, conceded: 2, margin: 2, result: 'W', scorers: [] },
    ]

    const result = groupWinnersByGameweek(winners)

    expect(result[0]!.gameweek).toBe(3)
    expect(result[1]!.gameweek).toBe(2)
    expect(result[2]!.gameweek).toBe(1)
  })

  test('handles multiple winners in same gameweek', () => {
    const winners = [
      { gameweek: 5, name: 'Alice', managerId: 1, goals: 11, conceded: 3, margin: 8, result: 'W', scorers: [{ playerId: 1, name: 'Smith', goals: 11 }] },
      { gameweek: 5, name: 'Bob', managerId: 2, goals: 11, conceded: 3, margin: 8, result: 'W', scorers: [{ playerId: 2, name: 'Jones', goals: 11 }] },
    ]

    const result = groupWinnersByGameweek(winners)

    expect(result).toHaveLength(1)
    expect(result[0]!.gameweek).toBe(5)
    expect(result[0]!.winners).toHaveLength(2)
    expect(result[0]!.winners[0]!.name).toBe('Alice')
    expect(result[0]!.winners[1]!.name).toBe('Bob')
  })

  test('returns empty array for empty input', () => {
    const result = groupWinnersByGameweek([])

    expect(result).toEqual([])
  })
})
