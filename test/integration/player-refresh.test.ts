import { vi, describe, beforeEach, test, expect } from 'vitest'
import fs from 'node:fs'
import { resolve } from 'node:path'

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }))
vi.mock('../../src/api/post.ts', () => ({ post: mockPost }))

import { refreshPlayers } from '../../src/refresh/players/refresh.ts'

const BASE_TEST_FILE = resolve(import.meta.dirname, '../files/player-list.xlsx')
const TEST_FILE = resolve(import.meta.dirname, '../files/player-list-tmp.xlsx')

describe('refreshing player list', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE)
    }
    fs.copyFileSync(BASE_TEST_FILE, TEST_FILE)
  })

  test('should return preview response with mapped players', async () => {
    mockPost.mockResolvedValue({ mappedPlayers: [{ firstName: 'Ian', lastName: 'Henderson', position: 'Forward', teamId: 1 }], unmappedTeams: [] })

    const result = await refreshPlayers(TEST_FILE) as { mappedPlayers: any[]; unmappedTeams: any[] }

    expect(result.mappedPlayers).toHaveLength(1)
    expect(result.unmappedTeams).toHaveLength(0)
    expect(mockPost.mock.calls).toHaveLength(1)
  })

  test('should return preview response with unmapped teams', async () => {
    mockPost.mockResolvedValue({ mappedPlayers: [], unmappedTeams: [{ team: 'Wycombe', players: [{ firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'FWD' }] }] })

    const result = await refreshPlayers(TEST_FILE) as { mappedPlayers: any[]; unmappedTeams: any[] }

    expect(result.unmappedTeams).toHaveLength(1)
    expect(result.unmappedTeams[0].team).toBe('Wycombe')
  })

  test('request should be made to preview endpoint', async () => {
    mockPost.mockResolvedValue({ mappedPlayers: [], unmappedTeams: [] })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0]![0]).toBe('/league/players/refresh/preview')
  })

  test('request should include all players', async () => {
    mockPost.mockResolvedValue({ mappedPlayers: [], unmappedTeams: [] })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0]![1].players).toHaveLength(2176)
  })

  test('request should include example player', async () => {
    mockPost.mockResolvedValue({ mappedPlayers: [], unmappedTeams: [] })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0]![1].players).toContainEqual({ firstName: 'Ian', lastName: 'Henderson', position: 'FWD', team: 'Rochdale' })
  })
})
