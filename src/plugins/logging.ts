import hapiPino from 'hapi-pino'

export default {
  plugin: hapiPino,
  options: {
    logPayload: false,
    level: 'warn',
  },
}
