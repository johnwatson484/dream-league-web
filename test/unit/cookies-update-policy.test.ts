const { mockCreateDefaultPolicy } = vi.hoisted(() => ({
  mockCreateDefaultPolicy: vi.fn(),
}))

vi.mock('../../src/cookies/get-cookie-options.ts', () => ({
  getCookieOptions: () => ({ path: '/', isSecure: true }),
}))

vi.mock('../../src/cookies/create-default-policy.ts', () => ({
  createDefaultPolicy: mockCreateDefaultPolicy,
}))

import { updatePolicy } from '../../src/cookies/update-policy.ts'

describe('cookie policy update', () => {
  test('enables analytics when the user opts in', () => {
    const request = { state: { cookies_policy: { confirmed: false, essential: true, analytics: false } } }
    const h = { state: vi.fn() }

    updatePolicy(request, h, true)

    expect(h.state).toHaveBeenCalledWith(
      'cookies_policy',
      { confirmed: true, essential: true, analytics: true },
      { path: '/', isSecure: true }
    )
  })

  test('disables analytics when the user opts out', () => {
    const request = { state: { cookies_policy: { confirmed: true, essential: true, analytics: true } } }
    const h = { state: vi.fn() }

    updatePolicy(request, h, false)

    expect(h.state).toHaveBeenCalledWith(
      'cookies_policy',
      { confirmed: true, essential: true, analytics: false },
      { path: '/', isSecure: true }
    )
  })

  test('marks the policy as confirmed after updating', () => {
    const request = { state: { cookies_policy: { confirmed: false, essential: true, analytics: false } } }
    const h = { state: vi.fn() }

    updatePolicy(request, h, false)

    const savedPolicy = h.state.mock.calls[0][1]
    expect(savedPolicy.confirmed).toBe(true)
  })

  test('creates a default policy if none exists before updating', () => {
    mockCreateDefaultPolicy.mockReturnValue({ confirmed: false, essential: true, analytics: false })
    const request = { state: {} }
    const h = { state: vi.fn() }

    updatePolicy(request, h, true)

    expect(mockCreateDefaultPolicy).toHaveBeenCalledWith(h)
    expect(h.state).toHaveBeenCalledWith(
      'cookies_policy',
      { confirmed: true, essential: true, analytics: true },
      { path: '/', isSecure: true }
    )
  })
})
