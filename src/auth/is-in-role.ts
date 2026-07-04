export function isInRole (credentials, role) {
  if (!credentials?.scope) {
    return false
  }
  return credentials.scope.includes(role)
}
