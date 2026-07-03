const { mockMapPlayer, mockMapPosition, mockMapSubstitute } = vi.hoisted(() => ({
  mockMapPlayer: vi.fn(),
  mockMapPosition: vi.fn(),
  mockMapSubstitute: vi.fn(),
}))

vi.mock('../../src/refresh/teamsheet/map-player.js', () => ({
  mapPlayer: mockMapPlayer,
}))

vi.mock('../../src/refresh/teamsheet/map-position.js', () => ({
  mapPosition: mockMapPosition,
}))

vi.mock('../../src/refresh/teamsheet/map-substitute.js', () => ({
  mapSubstitute: mockMapSubstitute,
}))

import { mapTeam } from '../../src/refresh/teamsheet/map-team.js'

describe('teamsheet team extraction from worksheet', () => {
  test('extracts 15 players from a worksheet column starting 3 rows below the manager', () => {
    mockMapPosition.mockReturnValue('MID')
    mockMapSubstitute.mockReturnValue(false)
    mockMapPlayer.mockReturnValue({ player: 'Test Player', position: 'MID', substitute: false })

    const worksheet = {}
    const cellAddress = { c: 2, r: 0 }

    const result = mapTeam(worksheet, '  Alice  ', cellAddress)

    expect(mockMapPlayer).toHaveBeenCalledTimes(15)
    expect(result.manager).toBe('Alice')
  })

  test('trims whitespace from the manager name', () => {
    mockMapPlayer.mockReturnValue(null)

    const result = mapTeam({}, '  Bob  ', { c: 0, r: 0 })

    expect(result.manager).toBe('Bob')
  })

  test('only includes players that are successfully mapped (non-null)', () => {
    mockMapPosition.mockReturnValue('DEF')
    mockMapSubstitute.mockReturnValue(false)
    mockMapPlayer
      .mockReturnValueOnce({ player: 'Player 1', position: 'GK', substitute: false })
      .mockReturnValueOnce(null)
      .mockReturnValue(null)

    const result = mapTeam({}, 'Alice', { c: 0, r: 0 })

    expect(result.players).toHaveLength(1)
    expect(result.players[0].player).toBe('Player 1')
  })

  test('passes the correct position and substitute flag for each player index', () => {
    mockMapPosition.mockImplementation((i) => i <= 1 ? 'GK' : 'DEF')
    mockMapSubstitute.mockImplementation((i) => i === 1)
    mockMapPlayer.mockReturnValue(null)

    mapTeam({}, 'Alice', { c: 0, r: 0 })

    expect(mockMapPosition).toHaveBeenCalledWith(0)
    expect(mockMapPosition).toHaveBeenCalledWith(14)
    expect(mockMapSubstitute).toHaveBeenCalledWith(0)
    expect(mockMapSubstitute).toHaveBeenCalledWith(1)
  })
})
