import config from '../config.ts'

export function createDefaultPolicy (h) {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
  return cookiesPolicy
}
