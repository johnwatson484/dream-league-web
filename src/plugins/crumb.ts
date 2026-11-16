import crumb from '@hapi/crumb'
import type { Request } from '@hapi/hapi'
import { getCookieOptions } from '../cookies/get-cookie-options.ts'

export default {
  plugin: crumb,
  options: {
    cookieOptions: getCookieOptions(),
    // Static files have no forms and should not create per-visitor CSRF cookies.
    skip: (request: Request) => ['/assets/{path*}', '/robots.txt', '/sitemap.xml'].includes(request.route.path),
  },
}
