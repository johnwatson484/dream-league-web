import type { ServerRoute } from '@hapi/hapi'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: '.public',
    },
  },
}]

export default routes
