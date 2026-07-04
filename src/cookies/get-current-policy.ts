import { createDefaultPolicy } from './create-default-policy.ts'

export function getCurrentPolicy (request, h) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}
