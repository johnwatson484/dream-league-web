import { get } from '../../api/get.js'
import { GET } from '../../constants/verbs.js'

export default [{
  method: GET,
  path: '/api/v1/meetings',
  options: {
    handler: async (request, h) => {
      const meetings = await get('/meetings', request.state.dl_token)
      return h.response(meetings)
    },
  },
}]
