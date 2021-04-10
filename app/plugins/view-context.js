// const config = require('../config').cookieOptions
// const { getCurrentPolicy } = require('../cookies')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, options) => {
      // server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.context) {
          request.response.source.context.currentYear = new Date().getUTCFullYear()
          const auth = mapAuth(request)
          request.response.source.context.auth = auth
          // const cookiesPolicy = getCurrentPolicy(request, h)
          // request.response.source.context.cookiesPolicy = cookiesPolicy
        }
        return h.continue
      })
    }
  }
}

function mapAuth (request) {
  return {
    isAuthenticated: request.auth.isAuthenticated,
    isAnonymous: !request.auth.isAuthenticated,
    isUser: isInRole(request.auth.credentials, 'user'),
    isAdmin: isInRole(request.auth.credentials, 'admin')
  }
}

function isInRole (credentials, role) {
  if (!credentials || !credentials.scope) {
    return false
  }
  return credentials.scope.includes(role)
}
