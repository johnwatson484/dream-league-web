import { GET } from '../constants/verbs.js'

export default [{
  method: GET,
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'src/public/css',
        'src/public/js',
        'src/public/assets',
      ],
    },
  },
}]
