import crumb from '@hapi/crumb'
import { getCookieOptions } from '../cookies/get-cookie-options.ts'

export default {
  plugin: crumb,
  options: {
    cookieOptions: getCookieOptions(),
  },
}
