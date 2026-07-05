import type { Plugin, ServerOptions } from '@hapi/hapi'

const MAX_USER_AGENT_LENGTH = 150

const plugin: Plugin<ServerOptions> = {
  name: 'userAgentProtection',
  version: '1.0.0',
  register: async function (server) {
    server.ext('onRequest', (request, h) => {
      const userAgent = request.headers['user-agent'] as string | undefined

      if (userAgent && userAgent.length > MAX_USER_AGENT_LENGTH) {
        // Truncate the User-Agent header to prevent ReDoS attacks
        request.headers['user-agent'] = userAgent.substring(0, MAX_USER_AGENT_LENGTH)
        server.log(['security', 'user-agent'], `Truncated User-Agent from ${userAgent.length} to ${MAX_USER_AGENT_LENGTH} chars`)
      }

      return h.continue
    })
  },
}

export default plugin
