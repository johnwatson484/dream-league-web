module.exports = {
  plugin: {
    name: 'map-auth',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500) {
          const auth = mapAuth(request)
          request.response.source.context.auth = auth
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
