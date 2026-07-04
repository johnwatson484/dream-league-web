import config from '../../config.ts'
import { POST } from '../../constants/verbs.ts'

export default [{
  method: POST,
  path: '/logout',
  handler: async (_request, h) => {
    return h.redirect('/')
      .unstate('dl_token', config.cookieOptionsIdentity)
  },
}]
