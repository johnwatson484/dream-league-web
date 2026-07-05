import type { Request } from '@hapi/hapi'

export function getConfiguration (request?: Request): { headers: Record<string, string>; json: boolean } {
  let token = ''

  if (request?.app?.session?.accessToken) {
    token = request.app.session.accessToken
  }

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    json: true,
  }
}
