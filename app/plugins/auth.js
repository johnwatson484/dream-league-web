const { jwtConfig } = require('../config')
const { validate } = require('../token')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate,
        cookieKey: 'dl_token'
      })
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    }
  }
}
