import ViewModel from '../../src/routes/models/teamsheet.js'

describe('teamsheet view model', () => {
  test('pads keepers array to 2 slots with placeholder objects', () => {
    const teamsheet = [{
      managerId: 1,
      name: 'Alice',
      keepers: [{ teamId: 10 }],
      players: [],
    }]

    const result = ViewModel(teamsheet)

    expect(result[0].keepers).toHaveLength(2)
    expect(result[0].keepers[0]).toEqual({ teamId: 10 })
    expect(result[0].keepers[1]).toEqual({ teamId: 0 })
  })

  test('pads players array to 13 slots with placeholder objects', () => {
    const teamsheet = [{
      managerId: 1,
      name: 'Alice',
      keepers: [],
      players: [{ playerId: 5 }, { playerId: 6 }],
    }]

    const result = ViewModel(teamsheet)

    expect(result[0].players).toHaveLength(13)
    expect(result[0].players[0]).toEqual({ playerId: 5 })
    expect(result[0].players[1]).toEqual({ playerId: 6 })
    expect(result[0].players[2]).toEqual({ playerId: 0 })
  })

  test('preserves manager ID and name for each team', () => {
    const teamsheet = [{
      managerId: 7,
      name: 'Bob',
      keepers: [],
      players: [],
    }]

    const result = ViewModel(teamsheet)

    expect(result[0].managerId).toBe(7)
    expect(result[0].name).toBe('Bob')
  })

  test('handles a full roster without adding placeholders', () => {
    const keepers = [{ teamId: 1 }, { teamId: 2 }]
    const players = Array.from({ length: 13 }, (_, i) => ({ playerId: i + 1 }))
    const teamsheet = [{ managerId: 1, name: 'Alice', keepers, players }]

    const result = ViewModel(teamsheet)

    expect(result[0].keepers).toHaveLength(2)
    expect(result[0].players).toHaveLength(13)
    expect(result[0].keepers[0]).toEqual({ teamId: 1 })
    expect(result[0].players[12]).toEqual({ playerId: 13 })
  })
})
