const RATE_LIMITED_PATHS = new Set(['/login', '/register', '/forgot-password'])
const POINTS = 10
const WINDOW_MS = 60 * 1000
const BLOCK_MS = 5 * 60 * 1000

const store = new Map()

function getEntry (ip) {
  const now = Date.now()
  let entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS, blockedUntil: 0 }
    store.set(ip, entry)
  }

  return entry
}

export default {
  plugin: {
    name: 'rate-limiting',
    register: (server) => {
      server.ext('onPreAuth', (request, h) => {
        if (request.method !== 'post' || !RATE_LIMITED_PATHS.has(request.path)) {
          return h.continue
        }

        const forwarded = request.headers['x-forwarded-for']
        const ip = forwarded ? forwarded.split(',')[0].trim() : request.info.remoteAddress
        const now = Date.now()
        const entry = getEntry(ip)

        if (entry.blockedUntil > now) {
          return h.response('Too many requests').code(429).takeover()
        }

        entry.count++

        if (entry.count > POINTS) {
          entry.blockedUntil = now + BLOCK_MS
          return h.response('Too many requests').code(429).takeover()
        }

        return h.continue
      })
    },
  },
}
