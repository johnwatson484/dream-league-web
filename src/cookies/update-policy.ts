import config from '../config.ts'
import { createDefaultPolicy } from './create-default-policy.ts'

export function updatePolicy (request, h, analytics) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
}
