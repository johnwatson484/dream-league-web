import { isInRole } from './is-in-role.ts'

export function mapAuth (request) {
  return {
    isAuthenticated: request.auth.isAuthenticated,
    isAnonymous: !request.auth.isAuthenticated,
    isUser: request.auth.isAuthenticated && isInRole(request.auth.credentials, 'user'),
    isAdmin: request.auth.isAuthenticated && isInRole(request.auth.credentials, 'admin'),
  }
}
