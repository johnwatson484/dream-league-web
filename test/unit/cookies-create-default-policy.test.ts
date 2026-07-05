vi.mock('../../src/cookies/get-cookie-options.ts', () => ({
  getCookieOptions: () => ({ path: '/', isSecure: true }),
}))

import { createDefaultPolicy } from '../../src/cookies/create-default-policy.ts'

describe('default cookie policy creation', () => {
  test('creates a policy that is unconfirmed with analytics disabled', () => {
    const h = { state: vi.fn() }

    const result = createDefaultPolicy(h)

    expect(result).toEqual({ confirmed: false, essential: true, analytics: false })
  })

  test('essential cookies are always enabled by default', () => {
    const h = { state: vi.fn() }

    const result = createDefaultPolicy(h)

    expect(result.essential).toBe(true)
  })

  test('sets the cookie policy on the response', () => {
    const h = { state: vi.fn() }

    createDefaultPolicy(h)

    expect(h.state).toHaveBeenCalledWith(
      'cookies_policy',
      { confirmed: false, essential: true, analytics: false },
      { path: '/', isSecure: true }
    )
  })
})
