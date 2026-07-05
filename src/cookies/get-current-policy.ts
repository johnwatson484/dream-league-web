import type { Request, ResponseToolkit } from '@hapi/hapi'
import { createDefaultPolicy } from './create-default-policy.ts'

interface CookiesPolicy {
  confirmed: boolean
  essential: boolean
  analytics: boolean
}

export function getCurrentPolicy (request: Request, h: ResponseToolkit): CookiesPolicy {
  let cookiesPolicy = request.state.cookies_policy as CookiesPolicy | undefined
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}
