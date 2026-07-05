import type { Request, ResponseToolkit } from '@hapi/hapi'
import { getCookieOptions } from './get-cookie-options.ts'
import { createDefaultPolicy } from './create-default-policy.ts'

interface CookiesPolicy {
  confirmed: boolean
  essential: boolean
  analytics: boolean
}

export function updatePolicy (request: Request, h: ResponseToolkit, analytics: boolean): void {
  let cookiesPolicy = request.state.cookies_policy as CookiesPolicy | undefined
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, getCookieOptions())
}
