import config from '../config.ts'
import { validate } from '../auth/validate.ts'

export default {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: config.jwtConfig.secret,
        validate,
        cookieKey: 'dl_token',
        verifyOptions: { algorithms: ['HS256'] },
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    },
  },
}
