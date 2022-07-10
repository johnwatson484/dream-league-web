const cookieOptions = require('../config').cookieOptions
const { getCurrentPolicy } = require('../cookies')
const { mapAuth } = require('../auth')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _options) => {
      server.state('cookies_policy', cookieOptions)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.context) {
          request.response.source.context.currentYear = new Date().getUTCFullYear()
          request.response.source.context.auth = mapAuth(request)
          request.response.source.context.cookiesPolicy = getCurrentPolicy(request, h)
        }
        return h.continue
      })
    }
  }
}
