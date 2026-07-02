import crumb from '@hapi/crumb'
import { cookieOptions } from '../config.js'

export default {
  plugin: crumb,
  options: {
    cookieOptions,
  },
}
