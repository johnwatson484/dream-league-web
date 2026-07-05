import type { ServerStateCookieOptions } from '@hapi/hapi'
import config from '../config.ts'

export function getCookieOptions (): ServerStateCookieOptions {
  return {
    ttl: config.get('cookie.ttl'),
    encoding: config.get('cookie.encoding') as ServerStateCookieOptions['encoding'],
    isSameSite: config.get('cookie.isSameSite') as ServerStateCookieOptions['isSameSite'],
    isSecure: config.get('isSecure'),
    isHttpOnly: config.get('cookie.isHttpOnly'),
    clearInvalid: config.get('cookie.clearInvalid'),
    strictHeader: config.get('cookie.strictHeader'),
    path: '/',
  }
}
