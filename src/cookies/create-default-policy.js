import config from '../config.js'

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
  return cookiesPolicy
}

export { createDefaultPolicy }
