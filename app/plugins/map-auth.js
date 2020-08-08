module.exports = {
  plugin: {
    name: 'map-auth',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        if (request.response.variety === 'view') {
          const auth = mapAuth(request)
          request.response.source.context.auth = auth
        }
        return h.continue
      })
    }
  }
}

function mapAuth (request) {
  return request.auth.isAuthenticated ? {
    isAuthenticated: true,
    isAnonymous: false,
    isUser: isInRole(request.auth.credentials, 'user'),
    isAdmin: isInRole(request.auth.credentials, 'admin')
  } : {
    isAuthenticated: false,
    isAnonymous: true,
    isUser: false,
    isAdmin: false
  }
}

function isInRole (credentials, role) {
  if (!credentials || !credentials.scope) {
    return false
  }
  return credentials.scope.includes(role)
}
