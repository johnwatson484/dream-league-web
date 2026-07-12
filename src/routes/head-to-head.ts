import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/head-to-head',
  options: {
    validate: {
      query: Joi.object({
        manager1: Joi.number().integer().optional(),
        manager2: Joi.number().integer().optional(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const managers = await get('/managers', request) as any[]
      const query = request.query as Record<string, unknown>
      const manager1 = Number(query.manager1) || 0
      const manager2 = Number(query.manager2) || 0

      let headToHead = null
      if (manager1 && manager2 && manager1 !== manager2) {
        headToHead = await get(`/statistics/head-to-head?manager1=${manager1}&manager2=${manager2}`, request)
      }

      return h.view('head-to-head', { managers, headToHead, manager1, manager2 })
    },
  },
}]

export default routes
