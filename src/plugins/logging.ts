import type { ServerRegisterPluginObject } from '@hapi/hapi'
import hapiPino from 'hapi-pino'

export default {
  plugin: hapiPino,
  options: {
    logPayload: false,
    level: 'warn',
  },
} as unknown as ServerRegisterPluginObject<unknown>
