const api = require('../../app/api')
jest.mock('../../app/api')
const fs = require('fs')
const path = require('path')
const { refreshPlayers } = require('../../app/refresh')

const BASE_TEST_FILE = path.resolve(__dirname, '../files/player-list.xlsx')
const TEST_FILE = path.resolve(__dirname, '../files/player-list-tmp.xlsx')

describe('refreshing player list', () => {
  afterEach(() => {
    jest.clearAllMocks()
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE)
    }
  })
  beforeEach(() => {
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE)
    }
    fs.copyFileSync(BASE_TEST_FILE, TEST_FILE)
  })

  test('should return success if list valid', async () => {
    api.post.mockResolvedValue({ success: true })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeTruthy()
    expect(api.post.mock.calls.length).toBe(1)
  })

  test('should return failure if list invalid', async () => {
    api.post.mockResolvedValue({ success: false })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeFalsy()
    expect(api.post.mock.calls.length).toBe(1)
  })

  test('request should be made to refresh endpoint', async () => {
    api.post.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(api.post.mock.calls[0][0]).toBe('/league/players/refresh')
  })

  test('request should include all players', async () => {
    api.post.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(api.post.mock.calls[0][1].players.length).toBe(2176)
  })

  test('request should include example player', async () => {
    api.post.mockResolvedValue({ success: true })

    await refreshPlayers(TEST_FILE)

    expect(api.post.mock.calls[0][1].players).toContainEqual({ firstName: 'Ian', lastName: 'Henderson', position: 'FWD', team: 'Rochdale' })
  })

  test('should return failure should include unmapped players', async () => {
    api.post.mockResolvedValue({ success: false, unmappedPlayers: [{ firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'FWD', team: 'Wycombe' }] })

    const result = await refreshPlayers(TEST_FILE)

    expect(result.success).toBeFalsy()
    expect(result.unmappedPlayers.length).toBe(1)
    expect(result.unmappedPlayers).toContainEqual({ firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'FWD', team: 'Wycombe' })
  })
})
