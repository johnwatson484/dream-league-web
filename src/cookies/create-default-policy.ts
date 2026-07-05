import type { ResponseToolkit } from '@hapi/hapi'
import { getCookieOptions } from './get-cookie-options.ts'

interface CookiesPolicy {
  confirmed: boolean
  essential: boolean
  analytics: boolean
}

export function createDefaultPolicy (h: ResponseToolkit): CookiesPolicy {
  const cookiesPolicy: CookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, getCookieOptions())
  return cookiesPolicy
}
