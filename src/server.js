import Hapi from '@hapi/hapi'
import Joi from 'joi'
import scooter from '@hapi/scooter'
import inert from '@hapi/inert'
import hapiAuthJwt2 from 'hapi-auth-jwt2'
import config from './config.js'
import userAgentProtection from './plugins/user-agent-protection.js'
import views from './plugins/views.js'
import contentSecurityPolicy from './plugins/content-security-policy.js'
import auth from './plugins/auth.js'
import qs from './plugins/qs.js'
import router from './plugins/router.js'
import errors from './plugins/errors.js'
import headers from './plugins/headers.js'
import crumb from './plugins/crumb.js'
import logging from './plugins/logging.js'
import tokenRefresh from './plugins/token-refresh.js'
import rateLimiting from './plugins/rate-limiting.js'

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

  server.validator(Joi)
  server.state('cookies_policy', config.cookieOptions)

  await server.register(userAgentProtection)
  await server.register(scooter)
  await server.register(inert)
  await server.register(hapiAuthJwt2)
  await server.register(views)

  server.ext('onPreResponse', (request, h) => {
    if (!request.state?.cookies_policy && request.response.variety === 'view') {
      h.state('cookies_policy', { confirmed: false, essential: true, analytics: false }, config.cookieOptions)
    }
    return h.continue
  })

  await server.register(contentSecurityPolicy)
  await server.register(auth)
  await server.register(tokenRefresh)
  await server.register(rateLimiting)
  await server.register(qs)
  await server.register(router)
  await server.register(errors)
  await server.register(headers)
  await server.register(crumb)
  await server.register(logging)
  return server
}

export { createServer }
