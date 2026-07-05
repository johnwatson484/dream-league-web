import type { ServerRoute } from '@hapi/hapi'
import { get } from '../../api/get.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/api/v1/winners',
  options: {
    handler: async (request, h) => {
      const winners = await get('/winners', request)
      return h.response(winners as object)
    },
  },
}]

export default routes
