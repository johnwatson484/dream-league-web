import { vi, describe, beforeEach, test, expect } from 'vitest'
import fs from 'fs'
import { resolve } from 'path'

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }))
vi.mock('../../app/api/index.js', () => ({ default: { post: mockPost }, post: mockPost }))

import { refreshTeamsheet } from '../../app/refresh/index.js'

const BASE_TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet.xlsx')
const TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet-tmp.xlsx')

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

    const result = await refreshTeamsheet(TEST_FILE)

    expect(result.success).toBeTruthy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('should return failure if list invalid', async () => {
    mockPost.mockResolvedValue({ success: false })

    const result = await refreshTeamsheet(TEST_FILE)

    expect(result.success).toBeFalsy()
    expect(mockPost.mock.calls.length).toBe(1)
  })

  test('request should be made to refresh endpoint', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    expect(mockPost.mock.calls[0][0]).toBe('/teamsheet/refresh')
  })

  test('request should include all teams', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    expect(mockPost.mock.calls[0][1].teams.length).toBe(13)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'John').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Lee').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Scott').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'David').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Billy').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Bob').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Conor').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Daz').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Rob').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Tucker').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Tommy/Pete').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Michael').length).toBe(1)
    expect(mockPost.mock.calls[0][1].teams.filter(x => x.manager === 'Ben').length).toBe(1)
  })

  test('request should include all players', async () => {
    mockPost.mockResolvedValue({ success: true })

    await refreshTeamsheet(TEST_FILE)

    expect(mockPost.mock.calls[0][1].teams[0].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[1].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[2].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[3].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[4].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[5].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[6].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[7].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[8].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[9].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[10].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[11].players.length).toBe(15)
    expect(mockPost.mock.calls[0][1].teams[12].players.length).toBe(15)
  })
})
