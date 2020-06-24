const { jwtConfig } = require('../config')
const { validate } = require('../token')

module.exports = {
  plugin: {
    name: 'token',
    register: (server, options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: jwtConfig.secret,
        validate
      })
    }
  }
}
