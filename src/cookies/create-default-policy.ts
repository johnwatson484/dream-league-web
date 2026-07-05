import { getCookieOptions } from './get-cookie-options.ts'

export function createDefaultPolicy (h) {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, getCookieOptions())
  return cookiesPolicy
}
