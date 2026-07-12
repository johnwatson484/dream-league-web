import type { ServerRoute } from '@hapi/hapi'
import config from '../../config.ts'
import { post } from '../../api/post.ts'
import { destroySession } from '../../session/session-manager.ts'

const routes: ServerRoute[] = [{
  method: 'POST',
  path: '/logout',
  handler: async (request, h) => {
    const sessionCookie = (request.state as Record<string, { sessionId?: string } | undefined>)?.[config.get('session.cookieName')]
    if (sessionCookie?.sessionId && request.app.session) {
      try {
        await post('/logout', { refreshToken: request.app.session.refreshToken }, request)
      } catch (err: any) {
        request.log(['warn', 'auth'], { msg: 'Remote token revocation failed', err: err?.message })
      }
      await destroySession(sessionCookie.sessionId)
    }
    return h.redirect('/')
      .unstate(config.get('session.cookieName'))
  },
}]

export default routes
