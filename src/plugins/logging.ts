import type { ServerRegisterPluginObject } from '@hapi/hapi'
import hapiPino from 'hapi-pino'
import logger from '../logger.ts'

export default {
  plugin: hapiPino,
  options: {
    instance: logger,
    level: 'warn',
    logPayload: false,
  },
} as unknown as ServerRegisterPluginObject<unknown>
