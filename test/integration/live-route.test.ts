import { vi } from 'vitest'

const { mockGet, mockWreckGet } = vi.hoisted(() => ({ mockGet: vi.fn(), mockWreckGet: vi.fn() }))

vi.mock('../../src/api/get.ts', () => ({ get: mockGet }))
vi.mock('@hapi/wreck', () => ({ default: { get: mockWreckGet } }))

const routes = (await import('../../src/routes/live.ts')).default

const handler = routes[0]!.handler as any

const request = { log: vi.fn() }

function view (): any {
  return { view: (template: string, context: any) => ({ template, context }) }
}

const gameweek = { gameweekId: 5, startDate: '2026-08-08T00:00:00.000Z', shortDate: '08/08/2026', isActive: true }
const managers = [{ managerId: 1, name: 'Alice' }, { managerId: 2, name: 'Bob' }]

function mockApi (overrides: Record<string, unknown> = {}): void {
  mockGet.mockImplementation(async (path: string) => {
    if (path === '/gameweeks') { return overrides.gameweeks ?? [gameweek] }
    if (path === '/managers') { return overrides.managers ?? managers }
    return []
  })
}

describe('live route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the live view with scores seeded from the videprinter summary', async () => {
    mockApi()
    mockWreckGet.mockResolvedValue({
      payload: {
        managers: [{ managerId: 2, manager: 'Bob', goals: 2, conceded: 1, scorers: [{ playerId: 9, name: 'Smith, John', goals: 2 }] }],
      },
    })

    const { template, context } = await handler(request, view())

    expect(template).toBe('live')
    expect(context.videprinterAvailable).toBe(true)
    expect(context.scores[0]).toMatchObject({ manager: 'Bob', goals: 2, conceded: 1, result: 'W' })
    expect(context.scores[0].scorers).toHaveLength(1)
  })

  test('requests the summary for the full gameweek', async () => {
    mockApi()
    mockWreckGet.mockResolvedValue({ payload: { managers: [] } })

    await handler(request, view())

    const [url, options] = mockWreckGet.mock.calls[0]!
    expect(url).toContain('/videprinter/summary?from=2026-08-08')
    expect(options.timeout).toBeGreaterThan(0)
  })

  test('degrades gracefully when the videprinter is unreachable', async () => {
    mockApi()
    mockWreckGet.mockRejectedValue(new Error('ECONNREFUSED'))

    const { context } = await handler(request, view())

    expect(context.videprinterAvailable).toBe(false)
    expect(context.scores).toHaveLength(2)
    expect(context.scores.every((s: any) => s.goals === 0)).toBe(true)
  })

  test('does not call the videprinter when there is no active gameweek', async () => {
    mockApi({ gameweeks: [{ ...gameweek, isActive: false }] })

    const { context } = await handler(request, view())

    expect(mockWreckGet).not.toHaveBeenCalled()
    expect(context.gameweek).toBeNull()
  })

  test('renders when the managers call fails', async () => {
    mockGet.mockImplementation(async (path: string) => {
      if (path === '/gameweeks') { return [gameweek] }
      throw new Error('api down')
    })
    mockWreckGet.mockResolvedValue({ payload: { managers: [] } })

    const { context } = await handler(request, view())

    expect(context.scores).toEqual([])
  })

  test('escapes markup in the json island so it cannot break out of the script tag', async () => {
    mockApi({ managers: [{ managerId: 1, name: '</script><img src=x onerror=alert(1)>' }] })
    mockWreckGet.mockResolvedValue({ payload: { managers: [] } })

    const { context } = await handler(request, view())

    expect(context.liveDataJson).not.toContain('</script>')
    expect(context.liveDataJson).toContain('\\u003c/script')
  })
})
