import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { CookiesPolicy } from './types.ts'
import { getCookieOptions } from './get-cookie-options.ts'
import { createDefaultPolicy } from './create-default-policy.ts'

export function updatePolicy (request: Request, h: ResponseToolkit, analytics: boolean): void {
  const cookiesPolicy = (request.state.cookies_policy as CookiesPolicy | undefined) ?? createDefaultPolicy(h)

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, getCookieOptions())
}
