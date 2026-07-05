import type { Request, ResponseToolkit } from '@hapi/hapi'
import type { CookiesPolicy } from './types.ts'
import { createDefaultPolicy } from './create-default-policy.ts'

export function getCurrentPolicy (request: Request, h: ResponseToolkit): CookiesPolicy {
  const cookiesPolicy = (request.state.cookies_policy as CookiesPolicy | undefined) ?? createDefaultPolicy(h)
  return cookiesPolicy
}
