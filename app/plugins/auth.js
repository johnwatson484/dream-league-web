import { jwtConfig } from '../config.js'
import { validate } from '../auth/index.js'

export default {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate,
        cookieKey: 'dl_token',
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    },
  },
}
