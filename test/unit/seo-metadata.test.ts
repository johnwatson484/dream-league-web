import { getSeoMetadata } from '../../src/seo/metadata.ts'

const options = { appName: 'Dream League', siteUrl: 'https://dreamleaguefantasyfootball.co.uk', statusCode: 200 }

describe('search metadata', () => {
  test('keeps the game name in the homepage title and structured data', () => {
    const seo = getSeoMetadata('/', {}, {}, options)

    expect(seo.title).toBe('Dream League')
    expect(seo.description).toContain('private fantasy football league')
    expect(JSON.parse(seo.structuredData!)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Dream League',
      url: `${options.siteUrl}/`,
    })
  })

  test.each([
    ['/teamsheet', 'Teamsheet'], ['/live', 'Live Scores'], ['/rules', 'Rules'], ['/history', 'History'],
  ])('gives %s a distinct title', (path, title) => {
    expect(getSeoMetadata(path!, {}, {}, options).title).toBe(`${title} | Dream League`)
  })

  test('preserves individual gameweeks while discarding tracking parameters', () => {
    const seo = getSeoMetadata('/results', { gameweekId: 14, utm_source: 'email' }, { results: { gameweekId: 14 } }, options)

    expect(seo.title).toBe('Week 14 Results | Dream League')
    expect(seo.canonical).toBe(`${options.siteUrl}/results?gameweekId=14`)
    expect(getSeoMetadata('/results', {}, { results: { gameweekId: 14 } }, options).canonical).toBe(`${options.siteUrl}/results`)
    expect(getSeoMetadata('/results', { gameweekId: 0 }, {}, options).canonical).toBe(`${options.siteUrl}/results`)
  })

  test.each([
    ['/league/player/detail', { playerId: 23 }, { player: { firstName: 'Joe', lastName: 'Smith' } }, 'Joe Smith', 'playerId=23'],
    ['/league/team/detail', { teamId: 4 }, { team: { name: 'Example United' } }, 'Example United', 'teamId=4'],
    ['/manager', { managerId: 8 }, { manager: { name: 'Jane' } }, 'Jane', 'managerId=8'],
  ])('keeps the identity of %s in its canonical URL', (path, query, context, name, identity) => {
    const seo = getSeoMetadata(path as string, query as Record<string, unknown>, context as Record<string, unknown>, options)
    expect(seo.title).toBe(`${name} | Dream League`)
    expect(seo.canonical).toBe(`${options.siteUrl}${path}?${identity}`)
    expect(seo.robots).toBeUndefined()
  })

  test('names cup pages without collapsing separate competitions', () => {
    const seo = getSeoMetadata('/cup/2', {}, { cup: { name: 'League Cup' } }, options)
    expect(seo.title).toBe('League Cup | Dream League')
    expect(seo.canonical).toBe(`${options.siteUrl}/cup/2`)
  })

  test.each([
    ['/league/players', { search: 'Smith' }], ['/league/players', { position: 'Forward' }],
    ['/league/teams', { division: 'League One' }], ['/head-to-head', { manager1: 1, manager2: 2 }],
    ['/login', {}], ['/results/edit', {}], ['/goal-report', {}],
  ])('excludes forms or filtered combinations at %s without blocking crawling', (path, query) => {
    const seo = getSeoMetadata(path as string, query as Record<string, unknown>, {}, options)
    expect(seo.robots).toBe('noindex, follow')
    expect(seo.canonical).toBeUndefined()
  })

  test('does not exclude an unfiltered listing or a tracking URL', () => {
    const seo = getSeoMetadata('/league/players', { search: '', position: '', utm_source: 'email' }, {}, options)
    expect(seo.robots).toBeUndefined()
    expect(seo.canonical).toBe(`${options.siteUrl}/league/players`)
  })

  test.each([400, 404, 500])('does not publish canonical URLs for a %s error', statusCode => {
    const seo = getSeoMetadata('/results', {}, {}, { ...options, statusCode })
    expect(seo.robots).toBe('noindex, follow')
    expect(seo.canonical).toBeUndefined()
  })

  test('uses the configured public origin and safely serializes site names', () => {
    const seo = getSeoMetadata('/', {}, {}, { ...options, appName: 'League </script>', siteUrl: 'https://example.com' })
    expect(seo.structuredData).not.toContain('</script>')
    expect(JSON.parse(seo.structuredData!).name).toBe('League </script>')
    expect(seo.canonical).toBe('https://example.com/')
  })
})
