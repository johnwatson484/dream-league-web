import type { Plugin, ServerOptions } from '@hapi/hapi'

const plugin: Plugin<ServerOptions> = {
  name: 'headers',
  register: (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response
      const headers: Record<string, string> | undefined = ('isBoom' in response && response.isBoom)
        ? response.output.headers as Record<string, string>
        : (response as unknown as { headers?: Record<string, string> }).headers

      if (headers) {
        headers['X-Content-Type-Options'] = 'nosniff'
        headers['X-Frame-Options'] = 'DENY'
        headers['X-XSS-Protection'] = '1; mode=block'
        // Cache-Control must be lower case to avoid conflicts with Hapi's built-in header handling
        const isHashedAsset = request.path.startsWith('/assets/') && /\.[\w-]{7}\.min\.(css|js)$/.test(request.path)
        const statusCode = 'isBoom' in response ? response.output.statusCode : response.statusCode
        // Cookie-bearing requests can refresh sessions; retain their revalidation policy.
        headers['cache-control'] = isHashedAsset && statusCode === 200 && !request.headers.cookie
          ? 'public, max-age=31536000, immutable'
          : 'no-cache'
        headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        headers['Cross-Origin-Resource-Policy'] = 'same-site'
        headers['Referrer-Policy'] = 'no-referrer'
        headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        headers['Permissions-Policy'] = 'camera=(), geolocation=(), magnetometer=(), microphone=(), payment=(), usb=()'
      }

      return h.continue
    })
  },
}

export default { plugin }
