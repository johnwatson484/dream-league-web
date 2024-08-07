const { GET } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'app/public/css',
        'app/public/js',
        'app/public/assets',
      ],
    },
  },
}]
