import config from '../../config.ts'
import { post } from '../../api/post.ts'
import { destroySession } from '../../session/session-manager.ts'
import { POST } from '../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/logout',
  handler: async (request, h) => {
    const sessionCookie = request.state?.[config.session.cookieName]
    if (sessionCookie?.sessionId && request.app.session) {
      try {
        await post('/logout', { refreshToken: request.app.session.refreshToken }, request)
      } catch {
        // Best-effort revocation — continue with local cleanup
      }
      await destroySession(sessionCookie.sessionId)
    }
    return h.redirect('/')
      .unstate(config.session.cookieName)
  },
}]
