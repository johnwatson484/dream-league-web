const config = require('../../config')

module.exports = [{
  method: 'POST',
  path: '/logout',
  handler: async (_request, h) => {
    return h.redirect('/')
      .unstate('dl_token', config.cookieOptionsIdentity)
  }
}]
