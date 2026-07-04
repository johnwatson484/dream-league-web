import Joi from 'joi'
import boom from '@hapi/boom'
import { post } from '../api/post.ts'
import { POST } from '../constants/verbs.ts'

export default [{
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
        return boom.badRequest(error)
      },
    },
    handler: async (request, h) => {
      const results = await post('/search/autocomplete', request.payload, request.state.dl_token)
      return h.response(results)
    },
  },
}]
