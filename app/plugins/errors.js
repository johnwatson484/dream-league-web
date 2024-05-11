module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const statusCode = response.output.statusCode

          if (statusCode === 401 || statusCode === 403) {
            return h.redirect('/login')
          }

          if (statusCode === 404) {
            return h.view('404').code(statusCode)
          }

          request.log('error', {
            statusCode,
            message: response?.message,
            payloadMessage: response?.data?.payload?.message,
            stack: response?.data?.stack
          })

          return h.view('500').code(statusCode)
        }
        return h.continue
      })
    }
  }
}
