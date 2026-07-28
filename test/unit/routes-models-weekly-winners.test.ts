import groupWinnersByGameweek from '../../src/routes/models/weekly-winners.ts'

describe('weekly winners view model', () => {
  test('groups winners by gameweek', () => {
    const winners = [
      { gameweek: 1, name: 'Alice', managerId: 1, goals: 7 },
      { gameweek: 1, name: 'Bob', managerId: 2, goals: 7 },
      { gameweek: 2, name: 'Charlie', managerId: 3, goals: 5 },
    ]

    const result = groupWinnersByGameweek(winners)

    expect(result).toHaveLength(2)
    expect(result[0]!.winners).toHaveLength(1)
    expect(result[1]!.winners).toHaveLength(2)
  })

  test('sorts gameweeks in descending order', () => {
    const winners = [
      { gameweek: 1, name: 'Alice', managerId: 1, goals: 5 },
      { gameweek: 3, name: 'Bob', managerId: 2, goals: 6 },
      { gameweek: 2, name: 'Charlie', managerId: 3, goals: 4 },
    ]

    const result = groupWinnersByGameweek(winners)

    expect(result[0]!.gameweek).toBe(3)
    expect(result[1]!.gameweek).toBe(2)
    expect(result[2]!.gameweek).toBe(1)
  })

  test('handles multiple winners in same gameweek', () => {
    const winners = [
      { gameweek: 5, name: 'Alice', managerId: 1, goals: 11 },
      { gameweek: 5, name: 'Bob', managerId: 2, goals: 11 },
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
