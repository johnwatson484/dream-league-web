import { GET } from '../constants/verbs.js'

export default [{
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
