const createDefaultPolicy = require('./create-default-policy')

const getCurrentPolicy = (request, h) => {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

module.exports = getCurrentPolicy
