import type { Request } from '@hapi/hapi'
import { isInRole } from './is-in-role.ts'

export function mapAuth (request: Request): { isAuthenticated: boolean; isAnonymous: boolean; isUser: boolean; isAdmin: boolean } {
  return {
    isAuthenticated: request.auth.isAuthenticated,
    isAnonymous: !request.auth.isAuthenticated,
    isUser: request.auth.isAuthenticated && isInRole(request.auth.credentials as { scope?: string[] } | null, 'user'),
    isAdmin: request.auth.isAuthenticated && isInRole(request.auth.credentials as { scope?: string[] } | null, 'admin'),
  }
}
