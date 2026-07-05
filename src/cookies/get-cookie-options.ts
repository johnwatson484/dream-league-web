import config from '../config.ts'

export function getCookieOptions () {
  return {
    ttl: config.get('cookie.ttl'),
    encoding: config.get('cookie.encoding'),
    isSameSite: config.get('cookie.isSameSite'),
    isSecure: config.get('isSecure'),
    isHttpOnly: config.get('cookie.isHttpOnly'),
    clearInvalid: config.get('cookie.clearInvalid'),
    strictHeader: config.get('cookie.strictHeader'),
    path: '/',
  }
}
