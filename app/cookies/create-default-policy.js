import { cookieOptions as config } from '../config.js'

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config)
  return cookiesPolicy
}

export { createDefaultPolicy }
