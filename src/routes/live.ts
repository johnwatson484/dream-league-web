import type { ServerRoute } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import boom from '@hapi/boom'
import { get } from '../api/get.ts'
import config from '../config.ts'
import { buildLiveScores } from './models/live.ts'
import { triggerGoalRematch } from '../api/videprinter.ts'

const SUMMARY_TIMEOUT_MS = 3000

// Escaped so a '</script>' in any value cannot break out of the JSON island.
function toJsonIsland (data: unknown): string {
  return JSON.stringify(data).replaceAll('<', String.raw`\u003c`)
}

async function getActiveGameweek (request: any): Promise<any> {
  try {
    const gameweeks = await get('/gameweeks', request) as any[]
    const active = Array.isArray(gameweeks) ? gameweeks.filter((gw: any) => gw.isActive) : []
    return active.at(-1) ?? null
  } catch (err: any) {
    request.log(['warn', 'api'], { msg: 'Failed to fetch gameweeks for live view', err: err?.message })
    return null
  }
}

async function getLiveSummary (request: any, videprinterHost: string, window: { startDate: Date; endDate: Date } | null): Promise<any> {
  if (!window) { return null }

  try {
    const summaryUrl = `${videprinterHost}/videprinter/summary?from=${window.startDate.toISOString()}&to=${window.endDate.toISOString()}`
    const { payload } = await Wreck.get(summaryUrl, { json: true, timeout: SUMMARY_TIMEOUT_MS })
    return payload
  } catch (err: any) {
    request.log(['warn', 'videprinter'], { msg: 'Failed to fetch live summary', err: err?.message })
    return null
  }
}

function getGameweekWindow (gameweek: any): { startDate: Date; endDate: Date } | null {
  if (!gameweek) { return null }

  const startDate = new Date(gameweek.startDate)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

async function getManagers (request: any): Promise<any[]> {
  try {
    return await get('/managers', request) as any[]
  } catch (err: any) {
    request.log(['warn', 'api'], { msg: 'Failed to fetch managers for live view', err: err?.message })
    return []
  }
}

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/live',
  handler: async (request, h) => {
    const videprinterHost = config.get('videprinterHost')
    const gameweek = await getActiveGameweek(request)
    const window = getGameweekWindow(gameweek)
    const [liveSummary, managers] = await Promise.all([
      getLiveSummary(request, videprinterHost, window),
      getManagers(request),
    ])

    const scores = buildLiveScores(managers, liveSummary)
    const historyParams = window ? `&from=${window.startDate.toISOString()}&to=${window.endDate.toISOString()}` : ''

    return h.view('live', {
      gameweek,
      scores,
      videprinterAvailable: liveSummary !== null,
      liveDataJson: toJsonIsland({
        streamUrl: `${videprinterHost}/videprinter/stream`,
        historyUrl: `${videprinterHost}/videprinter/history?limit=200${historyParams}`,
        scores,
      }),
    })
  },
}, {
  method: 'POST',
  path: '/live/refresh',
  options: {
    auth: { strategy: 'session', scope: ['admin'] },
  },
  handler: async (request, h) => {
    try {
      const summary = await triggerGoalRematch()
      return h.response(summary)
    } catch (err: any) {
      request.log(['warn', 'videprinter'], { msg: 'Failed to trigger goal rematch', err: err?.message })
      return boom.badGateway('Unable to reach videprinter service')
    }
  },
}]

export default routes
