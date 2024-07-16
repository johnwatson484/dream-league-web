const Hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  const server = Hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
    router: {
      stripTrailingSlash: true,
    },
  })

  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('hapi-auth-jwt2'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/qs'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/crumb'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/logging'))
  if (config.isDev) {
    await server.register(require('blipp'))
  }

  return server
}

module.exports = {
  createServer,
}
