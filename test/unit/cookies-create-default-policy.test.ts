import type { ResponseToolkit } from '@hapi/hapi'

vi.mock('../../src/cookies/get-cookie-options.ts', () => ({
  getCookieOptions: () => ({ path: '/', isSecure: true }),
}))

import { createDefaultPolicy } from '../../src/cookies/create-default-policy.ts'

describe('default cookie policy creation', () => {
  test('creates a policy that is unconfirmed with analytics disabled', () => {
    const h = { state: vi.fn() } as unknown as ResponseToolkit

    const result = createDefaultPolicy(h)

    expect(result).toEqual({ confirmed: false, essential: true, analytics: false })
  })

  test('essential cookies are always enabled by default', () => {
    const h = { state: vi.fn() } as unknown as ResponseToolkit

    const result = createDefaultPolicy(h)

    expect(result.essential).toBe(true)
  })

  test('sets the cookie policy on the response', () => {
    const h = { state: vi.fn() } as unknown as ResponseToolkit

    createDefaultPolicy(h)

    expect((h as unknown as { state: ReturnType<typeof vi.fn> }).state).toHaveBeenCalledWith(
      'cookies_policy',
      { confirmed: false, essential: true, analytics: false },
      { path: '/', isSecure: true }
    )
  })
})
