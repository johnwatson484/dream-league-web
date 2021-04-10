const api = require('../api')

async function validate (decoded, request, h) {
  return api.post('/validate', {
    token: decoded
  })
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

module.exports = {
  validate,
  mapAuth,
  isInRole
}
