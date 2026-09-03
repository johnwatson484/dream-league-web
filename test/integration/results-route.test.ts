import { vi } from 'vitest'

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))

vi.mock('../../src/api/get.ts', () => ({ get: mockGet }))
vi.mock('../../src/api/post.ts', () => ({ post: vi.fn() }))
vi.mock('../../src/api/delete.ts', () => ({ deleteRequest: vi.fn() }))

const routes = (await import('../../src/routes/results.ts')).default

const editHandler = routes[1]!.handler as any

const request = {}

function view (): any {
  return {
    view: (template: string, context: any) => ({ template, context }),
  }
}

function mockResultsInput (gameweeks: Record<string, unknown>[]): void {
  mockGet.mockResolvedValue({ keepers: [], players: [], gameweeks, cupWeeks: [] })
}

describe('results edit route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('selects the current gameweek when one is in progress', async () => {
    mockResultsInput([
      { gameweekId: 1, startDate: '2026-08-01', isActive: true, isCurrent: false },
      { gameweekId: 2, startDate: '2026-09-01', isActive: true, isCurrent: true },
      { gameweekId: 3, startDate: '2026-09-15', isActive: false, isCurrent: false },
    ])

    const { context } = await editHandler(request, view())

    expect(context.selectedGameweekId).toBe(2)
  })

  test('falls back to the most recently started gameweek when none is currently in progress', async () => {
    mockResultsInput([
      { gameweekId: 1, startDate: '2026-08-01', isActive: true, isCurrent: false },
      { gameweekId: 2, startDate: '2026-08-08', isActive: true, isCurrent: false },
      { gameweekId: 3, startDate: '2026-09-15', isActive: false, isCurrent: false },
    ])

    const { context } = await editHandler(request, view())

    expect(context.selectedGameweekId).toBe(2)
  })

  test('falls back to the first gameweek when the season has not started yet', async () => {
    mockResultsInput([
      { gameweekId: 1, startDate: '2026-09-15', isActive: false, isCurrent: false },
      { gameweekId: 2, startDate: '2026-09-22', isActive: false, isCurrent: false },
    ])

    const { context } = await editHandler(request, view())

    expect(context.selectedGameweekId).toBe(1)
  })

  test('returns a null selected gameweek when there are no gameweeks at all', async () => {
    mockResultsInput([])

    const { context } = await editHandler(request, view())

    expect(context.selectedGameweekId).toBeNull()
  })
})
