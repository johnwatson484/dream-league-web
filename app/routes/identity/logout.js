const config = require('../../config')

module.exports = [{
  method: 'POST',
  path: '/logout',
  handler: async (request, h) => {
    console.log('logging out')
    return h.redirect('/')
      .unstate('dl_token', config.cookieOptionsIdentity)
  }
}]
