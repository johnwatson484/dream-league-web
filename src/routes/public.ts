import type { ServerRoute } from '@hapi/hapi'
import config from '../config.ts'
import { publicPages } from '../seo/metadata.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/robots.txt',
  options: { auth: false, plugins: { crumb: false } },
  handler: (_request, h) => {
    const origin = new URL(config.get('siteUrl')).origin
    return h.response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`).type('text/plain')
  },
}, {
  method: 'GET',
  path: '/sitemap.xml',
  options: { auth: false, plugins: { crumb: false } },
  handler: (_request, h) => {
    const origin = new URL(config.get('siteUrl')).origin
    const urls = Object.keys(publicPages).map(path => `  <url><loc>${new URL(path, origin).href}</loc></url>`).join('\n')
    return h.response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`).type('application/xml')
  },
}, {
  method: 'GET',
  path: '/assets/{path*}',
  options: { auth: false, plugins: { crumb: false } },
  handler: {
    directory: {
      path: '.public',
    },
  },
}]

export default routes
