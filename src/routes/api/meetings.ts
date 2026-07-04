import { get } from '../../api/get.ts'
import { GET } from '../../constants/verbs.ts'

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
