import { vi } from 'vitest'

const { mockWreckPost } = vi.hoisted(() => ({ mockWreckPost: vi.fn() }))

vi.mock('@hapi/wreck', () => ({ default: { post: mockWreckPost } }))

const { triggerGoalRematch } = await import('../../src/api/videprinter.ts')

describe('triggerGoalRematch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('posts to the videprinter rematch endpoint with the api key header', async () => {
    mockWreckPost.mockResolvedValue({ payload: { eventsProcessed: 3, eventsChanged: 1, unmatched: 0, teamsheet: {} } })

    const summary = await triggerGoalRematch()

    expect(mockWreckPost).toHaveBeenCalledWith(
      'http://localhost:3002/videprinter/rematch',
      expect.objectContaining({ headers: { 'x-api-key': '' }, json: true })
    )
    expect(summary.eventsProcessed).toBe(3)
  })
})
