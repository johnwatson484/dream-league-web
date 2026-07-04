import crumb from '@hapi/crumb'
import config from '../config.ts'

export default {
  plugin: crumb,
  options: {
    cookieOptions: config.cookieOptions,
  },
}
