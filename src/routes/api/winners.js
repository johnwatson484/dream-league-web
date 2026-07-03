import { get } from '../../api/get.js'
import { GET } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/api/v1/winners',
  options: {
    handler: async (request, h) => {
      const winners = await get('/winners', request.state.dl_token)
      return h.response(winners)
    },
  },
}]
