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

  test('should return success if list valid', async () => {
    mockPost.mockResolvedValue({ success: true })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeTruthy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('should return failure if list invalid', async () => {
    mockPost.mockResolvedValue({ success: false })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeFalsy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('request should be made to refresh endpoint', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0][0]).toBe('/league/players/refresh')
  })

  test('request should include all players', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0][1].players.length).toBe(2176)
  })

  test('request should include example player', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(mockPost.mock.calls[0][1].players).toContainEqual({ firstName: 'Ian', lastName: 'Henderson', position: 'FWD', team: 'Rochdale' })
  })

  test('should return failure should include unmapped players', async () => {
    mockPost.mockResolvedValue({ success: false, unmappedPlayers: [{ firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'FWD', team: 'Wycombe' }] })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
    expect(result.unmappedPlayers).toContainEqual({ firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'FWD', team: 'Wycombe' })
  })
})
