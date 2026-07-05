import type { ResponseToolkit } from '@hapi/hapi'
import type { CookiesPolicy } from './types.ts'
import { getCookieOptions } from './get-cookie-options.ts'

export function createDefaultPolicy (h: ResponseToolkit): CookiesPolicy {
  const cookiesPolicy: CookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, getCookieOptions())
  return cookiesPolicy
}
