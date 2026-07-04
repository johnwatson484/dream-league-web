import { GET } from '../constants/verbs.ts'

export default [{
  method: GET,
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: '.public',
    },
  },
}]
