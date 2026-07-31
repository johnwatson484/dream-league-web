import type { ServerRoute } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import { get } from '../api/get.ts'
import config from '../config.ts'
import { buildLiveScores } from './models/live.ts'

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

async function getLiveSummary (request: any, videprinterHost: string, gameweek: any): Promise<any> {
  if (!gameweek) { return null }

  const startDate = new Date(gameweek.startDate)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)
  endDate.setHours(23, 59, 59, 999)

  try {
    const summaryUrl = `${videprinterHost}/videprinter/summary?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
    const { payload } = await Wreck.get(summaryUrl, { json: true, timeout: SUMMARY_TIMEOUT_MS })
    return payload
  } catch (err: any) {
    request.log(['warn', 'videprinter'], { msg: 'Failed to fetch live summary', err: err?.message })
    return null
  }
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
    const [liveSummary, managers] = await Promise.all([
      getLiveSummary(request, videprinterHost, gameweek),
      getManagers(request),
    ])

    const scores = buildLiveScores(managers, liveSummary)

    return h.view('live', {
      gameweek,
      scores,
      videprinterAvailable: liveSummary !== null,
      liveDataJson: toJsonIsland({
        streamUrl: `${videprinterHost}/videprinter/stream`,
        historyUrl: `${videprinterHost}/videprinter/history?limit=200`,
        scores,
      }),
    })
  },
}]

export default routes
