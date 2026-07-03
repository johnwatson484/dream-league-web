import config from '../../config.js'
import { POST } from '../../constants/verbs.js'

export default [{
  method: POST,
  path: '/logout',
  handler: async (_request, h) => {
    return h.redirect('/')
      .unstate('dl_token', config.cookieOptionsIdentity)
  },
}]
