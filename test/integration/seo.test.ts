import type { Server } from '@hapi/hapi'
import { vi } from 'vitest'

const { mockGet } = vi.hoisted(() => {
  vi.stubEnv('LOG_LEVEL', 'silent')
  vi.stubEnv('SITE_URL', 'https://dreamleaguefantasyfootball.co.uk')
  return { mockGet: vi.fn() }
})
vi.mock('../../src/api/get.ts', () => ({ get: mockGet }))
vi.mock('../../src/session/redis-client.ts', () => ({ connect: vi.fn() }))

const { createServer } = await import('../../src/server.ts')
const { default: config } = await import('../../src/config.ts')
let server: Server

const gameweeks = [
  { gameweekId: 3, shortDate: '22/08/2026' },
  { gameweekId: 1, shortDate: '08/08/2026' },
  { gameweekId: 2, shortDate: '15/08/2026' },
]

beforeAll(async () => { server = await createServer() })
afterAll(async () => {
  await server.stop()
  vi.unstubAllEnvs()
})
beforeEach(() => {
  mockGet.mockImplementation(async (url: string) => {
    if (url.startsWith('/results')) {
      return { gameweekId: Number(new URL(url, 'http://api').searchParams.get('gameweekId')) || 3, scores: [], table: [], cupScores: [], groups: [] }
    }
    if (url.startsWith('/gameweeks')) { return gameweeks }
    if (url.startsWith('/league/player?')) { return { firstName: 'Joe', lastName: 'Smith', team: { name: 'Example United' }, goals: [] } }
    if (url === '/meetings/next') { return {} }
    return []
  })
})

test('renders the homepage brand, description, site identity and member shortcuts anonymously', async () => {
  const response = await server.inject('/')
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('<title>Dream League</title>')
  expect(response.payload).toContain('<h1>Dream League</h1>')
  expect(response.payload).toContain('name="description"')
  expect(response.payload).toContain('rel="canonical" href="https://dreamleaguefantasyfootball.co.uk/"')
  expect(response.payload).not.toContain('name="robots"')
  const schema = response.payload.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1]!
  expect(JSON.parse(schema).name).toBe('Dream League')
  expect(response.payload).toContain('aria-label="League shortcuts"')
  for (const path of ['/results', '/teamsheet', '/live', '/rules']) {
    expect(response.payload).toContain(`href="${path}"`)
  }
})

test.each([
  ['/teamsheet', 'Teamsheet'], ['/rules', 'Rules'], ['/rules/', 'Rules'], ['/history', 'History'],
])('renders the correct title, description and main heading at %s', async (path, title) => {
  const response = await server.inject(path!)
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain(`<title>${title} | Dream League</title>`)
  expect(response.payload).toContain('name="description"')
  expect(response.payload).toContain('<h1')
})

test('renders gameweek titles, stable URLs and crawlable previous/next links', async () => {
  const response = await server.inject('/results?gameweekId=2')
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('<title>Week 2 Results | Dream League</title>')
  expect(response.payload).toContain('rel="canonical" href="https://dreamleaguefantasyfootball.co.uk/results?gameweekId=2"')
  expect(response.payload).toContain('href="/results?gameweekId=1">Previous: Week 1')
  expect(response.payload).toContain('href="/results?gameweekId=3">Next: Week 3')
  expect(response.payload).toContain('type="submit">View results')
})

test.each([
  [1, 'Next: Week 2', 'Previous:'], [3, 'Previous: Week 2', 'Next:'],
])('omits unavailable neighbours at the boundary gameweek %s', async (id, included, excluded) => {
  const response = await server.inject(`/results?gameweekId=${id}`)
  expect(response.payload).toContain(included as string)
  expect(response.payload).not.toContain(excluded as string)
})

test('renders useful results metadata when no results are available', async () => {
  mockGet.mockResolvedValue([])
  const response = await server.inject('/results')
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('<title>Results | Dream League</title>')
  expect(response.payload).toContain('<h1 class="h2">Results</h1>')
  expect(response.payload).not.toContain('aria-label="Gameweek results"')
})

test('renders the player identity rather than a generic page title', async () => {
  const response = await server.inject('/league/player/detail?playerId=23')
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('<title>Joe Smith | Dream League</title>')
  expect(response.payload).toContain('rel="canonical" href="https://dreamleaguefantasyfootball.co.uk/league/player/detail?playerId=23"')
})

test.each(['/login', '/league/players?search=Smith', '/league/teams?division=League%20One', '/not-a-page'])('excludes %s from indexing without publishing a misleading canonical', async path => {
  const response = await server.inject(path)
  expect(response.statusCode).toBe(path === '/not-a-page' ? 404 : 200)
  expect(response.payload).toContain('name="robots" content="noindex, follow"')
  expect(response.payload).not.toContain('rel="canonical"')
})

test('serves a public sitemap whose destinations can be visited anonymously', async () => {
  const response = await server.inject('/sitemap.xml')
  expect(response.statusCode).toBe(200)
  expect(response.headers['content-type']).toContain('application/xml')
  expect(response.headers['set-cookie']).toBeUndefined()
  const urls = [...response.payload.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]!)
  expect(urls).toContain('https://dreamleaguefantasyfootball.co.uk/')
  expect(urls).toContain('https://dreamleaguefantasyfootball.co.uk/teamsheet')
  for (const url of urls) {
    expect(url).not.toMatch(/login|edit|search|\?/)
    const page = await server.inject(new URL(url).pathname)
    expect(page.statusCode, url).toBe(200)
    expect(page.payload, url).not.toContain('name="robots"')
  }
})

test('serves robots instructions pointing to the configured public sitemap', async () => {
  const previous = config.get('siteUrl')
  config.set('siteUrl', 'https://example.com/')
  try {
    const response = await server.inject('/robots.txt')
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/plain')
    expect(response.headers['set-cookie']).toBeUndefined()
    expect(response.payload).toBe('User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n')
    const sitemap = await server.inject('/sitemap.xml')
    expect(sitemap.payload).toContain('<loc>https://example.com/results</loc>')
  } finally {
    config.set('siteUrl', previous)
  }
})

test('caches fingerprinted assets while keeping HTML and missing assets uncached', async () => {
  const homepage = await server.inject('/')
  const asset = homepage.payload.match(/href="(\/assets\/[^"]+\.min\.css)"/)![1]!
  const response = await server.inject(asset)
  expect(response.statusCode).toBe(200)
  expect(response.headers['cache-control']).toBe('public, max-age=31536000, immutable')
  expect(response.headers['set-cookie']).toBeUndefined()
  expect(homepage.headers['cache-control']).toBe('no-cache')
  const withCookies = await server.inject({ url: asset, headers: { cookie: 'example=value' } })
  expect(withCookies.headers['cache-control']).toBe('no-cache')
  const missing = await server.inject('/assets/missing.1234567.min.js')
  expect(missing.statusCode).toBe(404)
  expect(missing.headers['cache-control']).toBe('no-cache')
})
