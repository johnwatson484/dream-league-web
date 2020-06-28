const { cookieOptions } = require('../config')

module.exports = {
  plugin: require('@hapi/crumb'),
  options: {
    cookieOptions
  }
}
