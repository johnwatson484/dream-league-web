import config from '../config.js'
import { createDefaultPolicy } from './create-default-policy.js'

export function updatePolicy (request, h, analytics) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
}
