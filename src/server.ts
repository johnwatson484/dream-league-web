import Hapi from '@hapi/hapi'
import Joi from 'joi'
import scooter from '@hapi/scooter'
import inert from '@hapi/inert'
import hapiAuthJwt2 from 'hapi-auth-jwt2'
import config from './config.ts'
import userAgentProtection from './plugins/user-agent-protection.ts'
import views from './plugins/views.ts'
import contentSecurityPolicy from './plugins/content-security-policy.ts'
import auth from './plugins/auth.ts'
import qs from './plugins/qs.ts'
import router from './plugins/router.ts'
import errors from './plugins/errors.ts'
import headers from './plugins/headers.ts'
import crumb from './plugins/crumb.ts'
import logging from './plugins/logging.ts'

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
    if (!request.state?.cookies_policy && (request.response as any).variety === 'view') {
      h.state('cookies_policy', { confirmed: false, essential: true, analytics: false }, config.cookieOptions)
    }
    return h.continue
  })

  await server.register(contentSecurityPolicy)
  await server.register(auth)
  await server.register(qs)
  await server.register(router)
  await server.register(errors)
  await server.register(headers)
  await server.register(crumb)
  await server.register(logging)
  return server
}

export { createServer }
