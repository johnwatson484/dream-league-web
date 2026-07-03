import config from '../../config.js'
import { post } from '../../api/post.js'
import { POST } from '../../constants/verbs.js'

export default [{
  method: POST,
  path: '/logout',
  handler: async (request, h) => {
    try {
      await post('/token/revoke', {}, request.state.dl_token)
    } catch {
      // proceed with logout even if revocation fails
    }
    return h.redirect('/')
      .unstate('dl_token', config.cookieOptionsIdentity)
      .unstate('dl_refresh', config.cookieOptionsRefresh)
  },
}]
