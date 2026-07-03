import config from '../config.js'
import { post } from '../api/post.js'

export default {
  plugin: {
    name: 'token-refresh',
    register: (server, _options) => {
      server.ext('onPreAuth', async (request, h) => {
        const accessToken = request.state.dl_token
        const refreshCookie = request.state.dl_refresh

        if (accessToken || !refreshCookie) {
          return h.continue
        }

        if (!refreshCookie?.userId || !refreshCookie?.refreshToken) {
          return h.continue
        }

        try {
          const result = await post('/token/refresh', {
            userId: refreshCookie.userId,
            refreshToken: refreshCookie.refreshToken,
          })

          if (result?.token) {
            // Inject the new access token so the JWT strategy can validate it this request
            request.state.dl_token = result.token
            // Store new tokens on the request for the onPreResponse phase to set cookies
            request.app.refreshedTokens = {
              token: result.token,
              userId: result.userId,
              refreshToken: result.refreshToken,
            }
          }
        } catch {
          // refresh failed — user will be treated as unauthenticated
        }

        return h.continue
      })

      server.ext('onPreResponse', (request, h) => {
        const refreshed = request.app.refreshedTokens
        if (!refreshed) {
          return h.continue
        }

        const response = request.response.isBoom ? request.response : request.response
        if (response.isBoom) {
          return h.continue
        }

        response.state('dl_token', refreshed.token, config.cookieOptionsIdentity)
        response.state('dl_refresh',
          { userId: refreshed.userId, refreshToken: refreshed.refreshToken },
          config.cookieOptionsRefresh,
        )

        return h.continue
      })
    },
  },
}
