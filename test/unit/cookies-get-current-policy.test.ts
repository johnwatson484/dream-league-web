const { mockCreateDefaultPolicy } = vi.hoisted(() => ({
  mockCreateDefaultPolicy: vi.fn(),
}))

vi.mock('../../src/cookies/create-default-policy.ts', () => ({
  createDefaultPolicy: mockCreateDefaultPolicy,
}))

import { getCurrentPolicy } from '../../src/cookies/get-current-policy.ts'

describe('current cookie policy retrieval', () => {
  test('returns the existing cookie policy when one is set', () => {
    const existingPolicy = { confirmed: true, essential: true, analytics: true }
    const request = { state: { cookies_policy: existingPolicy } }
    const h = {}

    const result = getCurrentPolicy(request, h)

    expect(result).toEqual(existingPolicy)
    expect(mockCreateDefaultPolicy).not.toHaveBeenCalled()
  })

  test('creates a new default policy when no cookie exists', () => {
    const defaultPolicy = { confirmed: false, essential: true, analytics: false }
    mockCreateDefaultPolicy.mockReturnValue(defaultPolicy)
    const request = { state: {} }
    const h = {}

    const result = getCurrentPolicy(request, h)

    expect(mockCreateDefaultPolicy).toHaveBeenCalledWith(h)
    expect(result).toEqual(defaultPolicy)
  })

  test('creates a new default policy when cookie state is undefined', () => {
    const defaultPolicy = { confirmed: false, essential: true, analytics: false }
    mockCreateDefaultPolicy.mockReturnValue(defaultPolicy)
    const request = { state: { cookies_policy: undefined } }
    const h = {}

    const result = getCurrentPolicy(request, h)

    expect(result).toEqual(defaultPolicy)
  })
})
