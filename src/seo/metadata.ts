interface PageDefinition {
  title: string
  description: string
}

// Only these public destinations belong in the sitemap. Forms and search
// combinations remain usable without competing with the member-facing pages.
export const publicPages: Record<string, PageDefinition> = {
  '/': { title: '', description: 'Dream League is a private fantasy football league. Find the latest results, league table, teamsheets, live scores and competition rules.' },
  '/results': { title: 'Results', description: 'View the latest Dream League results, weekly scores, league table and cup results.' },
  '/teamsheet': { title: 'Teamsheet', description: 'View Dream League managers’ teamsheets, selected players, goalkeepers and substitutes.' },
  '/live': { title: 'Live Scores', description: 'Follow live Dream League scores and goals during the current gameweek.' },
  '/rules': { title: 'Rules', description: 'Read the Dream League rules for scoring, squad selection, auctions, monthly transfers and cup competitions.' },
  '/history': { title: 'History', description: 'Explore Dream League history and past winners of the league, cup and league cup.' },
  '/weekly-winners': { title: 'Weekly Winners', description: 'See the Dream League weekly winners and winning scores across the current season.' },
  '/league/players': { title: 'Players', description: 'Browse Dream League players, their positions, clubs and fantasy managers.' },
  '/league/teams': { title: 'Teams', description: 'Browse the clubs and divisions represented in Dream League.' },
  '/managers': { title: 'Managers', description: 'Find Dream League managers and follow links to their squads and season statistics.' },
  '/meetings': { title: 'Meetings', description: 'Check Dream League meeting dates and monthly transfer meetings.' },
  '/cups': { title: 'Cups', description: 'Browse Dream League cup competitions and their formats.' },
  '/fixtures': { title: 'Fixtures', description: 'Check Dream League cup fixtures, gameweeks and match results.' },
  '/head-to-head': { title: 'Head to Head', description: 'Compare two Dream League managers’ scores and results gameweek by gameweek.' },
  '/goals': { title: 'Goals', description: 'View recorded Dream League goals and the players who scored them.' },
  '/conceded': { title: 'Goals Conceded', description: 'View recorded Dream League goals conceded by goalkeepers.' },
}

export interface SeoMetadata {
  title: string
  description?: string
  canonical?: string
  robots?: string
  structuredData?: string
}

interface SeoOptions {
  appName: string
  siteUrl: string
  statusCode: number
}

function positiveInteger (value: unknown): string | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined
  }
  const text = String(value)
  return /^[1-9]\d*$/.test(text) ? text : undefined
}

function trimTrailingSlashes (path: string): string {
  let end = path.length
  while (end > 0 && path[end - 1] === '/') {
    end--
  }
  return path.slice(0, end) || '/'
}

function isFilteredPage (path: string, query: Record<string, unknown>): boolean {
  if (path === '/head-to-head') {
    return Boolean(query.manager1 || query.manager2)
  }
  return ['/league/players', '/league/teams'].includes(path) &&
    ['search', 'position', 'division'].some(key => Boolean(query[key]))
}

export function getSeoMetadata (
  path: string,
  query: Record<string, unknown>,
  context: Record<string, any>,
  { appName, siteUrl, statusCode }: SeoOptions
): SeoMetadata {
  path = trimTrailingSlashes(path)
  let page = publicPages[path]
  const canonical = new URL(path, siteUrl)

  if (statusCode !== 200) {
    return { title: appName, robots: 'noindex, follow' }
  }

  if (path === '/results') {
    const week = positiveInteger(context.results?.gameweekId)
    if (week) {
      page = { title: `Week ${week} Results`, description: `View Dream League week ${week} results, scores, league standings and cup results.` }
    }
    const requestedWeek = positiveInteger(query.gameweekId)
    if (requestedWeek) {
      canonical.searchParams.set('gameweekId', requestedWeek)
    }
  }

  const detailPages: Record<string, { id: string; value: unknown; name: string; description: string }> = {
    '/league/player/detail': {
      id: 'playerId',
      value: query.playerId,
      name: [context.player?.firstName, context.player?.lastName].filter(Boolean).join(' '),
      description: 'player profile, club, position and recorded goals',
    },
    '/league/team/detail': {
      id: 'teamId',
      value: query.teamId,
      name: context.team?.name || '',
      description: 'club details and players',
    },
    '/manager': {
      id: 'managerId',
      value: query.managerId,
      name: context.manager?.name || '',
      description: 'squad, scores and season statistics',
    },
  }
  const detail = detailPages[path]
  const detailId = positiveInteger(detail?.value)
  if (detail?.name && detailId) {
    page = { title: detail.name, description: `View ${detail.name}’s ${appName} ${detail.description}.` }
    canonical.searchParams.set(detail.id, detailId)
  }

  if (/^\/cup\/[1-9]\d*$/.test(path) && context.cup?.name) {
    page = { title: context.cup.name, description: `Follow ${appName} ${context.cup.name} fixtures, results and progression.` }
  }

  if (!page) {
    return { title: appName, robots: 'noindex, follow' }
  }

  const metadata: SeoMetadata = {
    title: page.title ? `${page.title} | ${appName}` : appName,
    description: page.description,
  }
  if (isFilteredPage(path, query)) {
    metadata.robots = 'noindex, follow'
  } else {
    metadata.canonical = canonical.href
  }

  if (path === '/') {
    // Escape '<' so a configured name cannot terminate the JSON-LD script tag.
    metadata.structuredData = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: appName, url: canonical.href }).replaceAll('<', String.raw`\u003c`)
  }
  return metadata
}
