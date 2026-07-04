import { get } from '../../api/get.ts'
import { GET } from '../../constants/verbs.ts'

export default [{
  method: GET,
  path: '/api/v1/meetings',
  options: {
    handler: async (request, h) => {
      const meetings = await get('/meetings', request)
      return h.response(meetings)
    },
  },
}]
