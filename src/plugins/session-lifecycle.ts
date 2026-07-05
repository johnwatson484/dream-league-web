import config from '../config.ts'
import { loadSession, updateSession, destroySession } from '../session/session-manager.ts'
import { post } from '../api/post.ts'

export default {
  plugin: {
    name: 'session-lifecycle',
    register: (server, _options) => {
      server.ext('onPreAuth', async (request, h) => {
        const cookieName = config.get('session.cookieName')
        const sessionCookie = request.state?.[cookieName]
        if (!sessionCookie?.sessionId) {
          request.app.session = null
          return h.continue
        }

        const session = await loadSession(sessionCookie.sessionId)
        if (!session) {
          h.unstate(cookieName)
          request.app.session = null
          return h.continue
        }

        const bufferMs = 60 * 1000
        if (session.accessTokenExpiresAt < Date.now() + bufferMs) {
          try {
            const response = await post('/token/refresh', { refreshToken: session.refreshToken })
            session.accessToken = response.accessToken
            session.refreshToken = response.refreshToken
            session.accessTokenExpiresAt = Date.now() + 15 * 60 * 1000
            await updateSession(sessionCookie.sessionId, session)
          } catch {
            await destroySession(sessionCookie.sessionId)
            h.unstate(cookieName)
            request.app.session = null
            return h.continue
          }
        }

        request.app.session = session
        return h.continue
      })
    },
  },
}
