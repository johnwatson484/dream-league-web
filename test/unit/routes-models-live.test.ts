import { buildLiveScores, getResult, sortScores } from '../../src/routes/models/live.ts'

const managers = [
  { managerId: 1, name: 'Alice' },
  { managerId: 2, name: 'Bob' },
  { managerId: 3, name: 'Charlie' },
]

describe('live view model', () => {
  test('returns every manager with zero scores when there is no summary', () => {
    const result = buildLiveScores(managers, null)

    expect(result).toHaveLength(3)
    expect(result.every(s => s.goals === 0 && s.conceded === 0)).toBe(true)
    expect(result.every(s => s.scorers.length === 0)).toBe(true)
  })

  test('seeds goals, conceded and scorers from the summary', () => {
    const result = buildLiveScores(managers, {
      managers: [{
        managerId: 2,
        manager: 'Bob',
        goals: 3,
        conceded: 1,
        scorers: [{ playerId: 10, name: 'Smith, John', goals: 2 }],
      }],
    })

    const bob = result.find(s => s.managerId === 2)!
    expect(bob.goals).toBe(3)
    expect(bob.conceded).toBe(1)
    expect(bob.scorers).toEqual([{ playerId: 10, name: 'Smith, John', goals: 2 }])
  })

  test('uses the manager name from the API rather than the videprinter summary', () => {
    const result = buildLiveScores(managers, {
      managers: [{ managerId: 1, manager: 'A Lice', goals: 1, conceded: 0, scorers: [] }],
    })

    expect(result[0]!.manager).toBe('Alice')
  })

  test('ignores summary entries for unknown managers', () => {
    const result = buildLiveScores(managers, {
      managers: [{ managerId: 99, manager: 'Nobody', goals: 5, conceded: 0, scorers: [] }],
    })

    expect(result).toHaveLength(3)
    expect(result.some(s => s.manager === 'Nobody')).toBe(false)
  })

  test('sorts by goals descending, then conceded ascending, then name', () => {
    const result = buildLiveScores(managers, {
      managers: [
        { managerId: 1, manager: 'Alice', goals: 2, conceded: 4, scorers: [] },
        { managerId: 2, manager: 'Bob', goals: 5, conceded: 0, scorers: [] },
        { managerId: 3, manager: 'Charlie', goals: 2, conceded: 1, scorers: [] },
      ],
    })

    expect(result.map(s => s.manager)).toEqual(['Bob', 'Charlie', 'Alice'])
  })

  test('falls back to alphabetical order when nobody has scored', () => {
    const result = buildLiveScores([
      { managerId: 3, name: 'Charlie' },
      { managerId: 1, name: 'Alice' },
      { managerId: 2, name: 'Bob' },
    ], null)

    expect(result.map(s => s.manager)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  test('handles an empty manager list', () => {
    expect(buildLiveScores([], null)).toEqual([])
  })
})

describe('live result derivation', () => {
  test.each([
    [3, 1, 'W'],
    [1, 3, 'L'],
    [2, 2, 'D'],
    [0, 0, 'D'],
  ])('%i - %i is %s', (goals, conceded, expected) => {
    expect(getResult(goals, conceded)).toBe(expected)
  })

  test('result is set on each seeded score', () => {
    const result = buildLiveScores(managers, {
      managers: [{ managerId: 1, manager: 'Alice', goals: 4, conceded: 2, scorers: [] }],
    })

    expect(result.find(s => s.managerId === 1)!.result).toBe('W')
    expect(result.find(s => s.managerId === 2)!.result).toBe('D')
  })
})

describe('live score sorting', () => {
  test('is stable for identical scores', () => {
    const scores = [
      { managerId: 2, manager: 'Bob', goals: 1, conceded: 1, result: 'D', scorers: [] },
      { managerId: 1, manager: 'Alice', goals: 1, conceded: 1, result: 'D', scorers: [] },
    ]

    expect(sortScores(scores).map(s => s.manager)).toEqual(['Alice', 'Bob'])
  })
})
