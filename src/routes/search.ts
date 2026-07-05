import type { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import boom from '@hapi/boom'
import { post } from '../api/post.ts'
import { POST } from '../constants/verbs.ts'

const routes: ServerRoute[] = [{
  method: POST,
  path: '/search/autocomplete',
  options: {
    plugins: {
      crumb: false,
    },
    validate: {
      payload: Joi.object({
        prefix: Joi.string().required(),
      }),
      failAction: async (_request, _h, error) => {
        return boom.badRequest(error?.message)
      },
    },
    handler: async (request, h) => {
      const results = await post('/search/autocomplete', request.payload, request)
      return h.response(results as object)
    },
  },
}]

export default routes
