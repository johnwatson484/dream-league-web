function mapAuth (request, h) {
  return h.response({
    isAuthenticated: request.auth.isAuthenticated,
    isUser: isInRole(request.auth.credentials, 'user'),
    isAdmin: isInRole(request.auth.credentials, 'admin')
  })
}

function isInRole (credentials, role) {
  if (!credentials || !credentials.scope) {
    return false
  }
  return credentials.scope.includes(role)
}

module.exports = mapAuth
