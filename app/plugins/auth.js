const { jwtConfig } = require('../config')
const { validate } = require('../auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate,
        cookieKey: 'dl_token'
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    }
  }
}
