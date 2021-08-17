const config = require('../config').cookieOptions
const createDefaultPolicy = require('./create-default-policy')

const updatePolicy = (request, h, analytics) => {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config)
}

module.exports = updatePolicy
