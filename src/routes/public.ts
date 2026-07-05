import type { ServerRoute } from '@hapi/hapi'
import { GET } from '../constants/verbs.ts'

const routes: ServerRoute[] = [{
  method: GET,
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: '.public',
    },
  },
}]

export default routes
