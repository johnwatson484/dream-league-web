module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logPayload: true,
    level: 'warn'
  }
}
