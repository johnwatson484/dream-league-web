import { constants as httpConstants } from 'node:http2'
import type { Plugin, ServerOptions } from '@hapi/hapi'

const { HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_NOT_FOUND } = httpConstants

const plugin: Plugin<ServerOptions> = {
  name: 'error-pages',
  register: (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response

      if ('isBoom' in response && response.isBoom) {
        const statusCode = response.output.statusCode

        if (statusCode === HTTP_STATUS_UNAUTHORIZED || statusCode === HTTP_STATUS_FORBIDDEN) {
          return h.redirect('/login')
        }

        if (statusCode === HTTP_STATUS_NOT_FOUND) {
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
