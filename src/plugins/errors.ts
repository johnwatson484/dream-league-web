import type { Plugin, ServerOptions } from '@hapi/hapi'

const plugin: Plugin<ServerOptions> = {
  name: 'error-pages',
  register: (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response

      if ('isBoom' in response && response.isBoom) {
        const statusCode = response.output.statusCode

        if (statusCode === 401 || statusCode === 403) {
          return h.redirect('/login')
        }

        if (statusCode === 404) {
          return h.view('404').code(statusCode)
        }

        request.log('error', {
          statusCode,
          message: response?.message,
          payloadMessage: (response?.data as Record<string, unknown> | null)?.payload,
          stack: (response?.data as Record<string, unknown> | null)?.stack,
        })

        return h.view('500').code(statusCode)
      }
      return h.continue
    })
  },
}

export default { plugin }
