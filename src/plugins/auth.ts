import cookie from '@hapi/cookie'
import config from '../config.ts'
import { loadSession } from '../session/session-manager.ts'

export default {
  plugin: {
    name: 'auth',
    register: async (server, _options) => {
      await server.register(cookie)

      server.auth.strategy('session', 'cookie', {
        cookie: {
          name: config.get('session.cookieName'),
          password: config.get('session.cookiePassword'),
          ttl: config.get('session.ttl'),
          isSecure: !config.get('isDev'),
          isHttpOnly: true,
          isSameSite: 'Lax',
          clearInvalid: true,
          path: '/',
        },
        validate: async (_request, session) => {
          const sessionData = await loadSession(session.sessionId)
          if (!sessionData) {
            return { isValid: false }
          }
          return {
            isValid: true,
            credentials: {
              userId: sessionData.userId,
              scope: sessionData.roles,
            },
          }
        },
      })

      server.auth.default({ strategy: 'session', mode: 'try' })
    },
  },
}
