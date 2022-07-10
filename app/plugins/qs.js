const Qs = require('qs')

module.exports = {
  plugin: {
    name: 'qs',
    register: (server, _options) => {
      server.ext('onPostAuth', (request, h) => {
        if (typeof request.payload === 'object' && !Buffer.isBuffer(request.payload)) {
          request.payload = Qs.parse(request.payload, { arrayLimit: 1000 })
        }
        return h.continue
      })
    }
  }
}
