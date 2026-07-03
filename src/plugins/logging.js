import hapiPino from 'hapi-pino'

export default {
  plugin: hapiPino,
  options: {
    logPayload: true,
    level: 'warn',
  },
}
