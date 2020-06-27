const mapAuth = require('../handlers/map-auth')

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
    pre: [{ method: mapAuth, assign: 'auth' }]
  },
  handler: (request, h) => {
    return h.view('home', { auth: request.pre.auth })
  }
}]
