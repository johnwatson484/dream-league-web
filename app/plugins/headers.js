module.exports = {
  plugin: {
    name: 'headers',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.headers) {
          response.headers['X-Content-Type-Options'] = 'nosniff'
          response.headers['X-Frame-Options'] = 'DENY'
          response.headers['X-Robots-Tag'] = 'noindex, nofollow'
          response.headers['X-XSS-Protection'] = '1; mode=block'
          response.headers['Cache-Control'] = 'no-cache'
          response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
          response.headers['Cross-Origin-Resource-Policy'] = 'same-site'
          response.headers['Referrer-Policy'] = 'no-referrer'
          response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
          response.headers['Permissions-Policy'] = 'camera=(), geolocation=(), magnetometer=(), microphone=(), payment=(), usb=()'
        }

        return h.continue
      })
    },
  },
}
