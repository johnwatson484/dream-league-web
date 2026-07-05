import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { CookiesPolicy } from './types.ts'
import { createDefaultPolicy } from './create-default-policy.ts'

export function getCurrentPolicy (request: Request, h: ResponseToolkit): CookiesPolicy {
  let cookiesPolicy = request.state.cookies_policy as CookiesPolicy | undefined
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}
