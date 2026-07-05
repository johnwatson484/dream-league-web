import type { Plugin, ServerOptions } from '@hapi/hapi'
import Qs from 'qs'

const plugin: Plugin<ServerOptions> = {
  name: 'qs',
  register: (server) => {
    server.ext('onPostAuth', (request, h) => {
      if (typeof request.payload === 'object' && !Buffer.isBuffer(request.payload)) {
        (request as unknown as { payload: unknown }).payload = Qs.parse(request.payload as Record<string, string>, { arrayLimit: 1000 })
      }
      return h.continue
    })
  },
}

export default { plugin }
