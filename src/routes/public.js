import { GET } from '../constants/verbs.js'

export default [{
  method: GET,
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: '.public',
    },
  },
}]
