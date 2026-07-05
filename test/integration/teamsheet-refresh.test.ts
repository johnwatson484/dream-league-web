import { vi, describe, beforeEach, test, expect } from 'vitest'
import fs from 'node:fs'
import { resolve } from 'node:path'

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }))
vi.mock('../../src/api/post.ts', () => ({ post: mockPost }))

import { refreshTeamsheet } from '../../src/refresh/teamsheet/refresh.ts'

const BASE_TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet.xlsx')
const TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet-tmp.xlsx')

interface TeamPayload {
  teams: { manager: string; players: unknown[] }[]
}

describe('refreshing teamsheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE)
    }
    fs.copyFileSync(BASE_TEST_FILE, TEST_FILE)
  })

  test('should return success if list valid', async () => {
    mockPost.mockResolvedValue({ success: true })

    const result = await refreshTeamsheet(TEST_FILE) as { success: boolean }

    expect(result.success).toBeTruthy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('should return failure if list invalid', async () => {
    mockPost.mockResolvedValue({ success: false })

    const result = await refreshTeamsheet(TEST_FILE) as { success: boolean }

    expect(result.success).toBeFalsy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('request should be made to refresh endpoint', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    expect(mockPost.mock.calls[0]![0]).toBe('/teamsheet/refresh')
  })

  test('request should include all teams', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    const payload = mockPost.mock.calls[0]![1] as TeamPayload
    expect(payload.teams.length).toBe(13)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'John').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Lee').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Scott').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'David').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Billy').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Bob').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Conor').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Daz').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Rob').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Tucker').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Tommy/Pete').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Michael').length).toBe(1)
    expect(payload.teams.filter((x: { manager: string }) => x.manager === 'Ben').length).toBe(1)
  })

  test('request should include all players', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    const payload = mockPost.mock.calls[0]![1] as TeamPayload
    expect(payload.teams[0]!.players.length).toBe(15)
    expect(payload.teams[1]!.players.length).toBe(15)
    expect(payload.teams[2]!.players.length).toBe(15)
    expect(payload.teams[3]!.players.length).toBe(15)
    expect(payload.teams[4]!.players.length).toBe(15)
    expect(payload.teams[5]!.players.length).toBe(15)
    expect(payload.teams[6]!.players.length).toBe(15)
    expect(payload.teams[7]!.players.length).toBe(15)
    expect(payload.teams[8]!.players.length).toBe(15)
    expect(payload.teams[9]!.players.length).toBe(15)
    expect(payload.teams[10]!.players.length).toBe(15)
    expect(payload.teams[11]!.players.length).toBe(15)
    expect(payload.teams[12]!.players.length).toBe(15)
  })
})
