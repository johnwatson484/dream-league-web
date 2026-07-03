import crumb from '@hapi/crumb'
import config from '../config.js'

export default {
  plugin: crumb,
  options: {
    cookieOptions: config.cookieOptions,
    headerName: 'x-csrf-token',
  },
}
