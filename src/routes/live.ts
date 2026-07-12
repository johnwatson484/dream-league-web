import type { ServerRoute } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import { get } from '../api/get.ts'
import config from '../config.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/live',
  handler: async (request, h) => {
    const gameweeks = await get('/gameweeks', request) as any[]
    const activeGameweeks = Array.isArray(gameweeks) ? gameweeks.filter((gw: any) => gw.isActive) : []
    const activeGameweek = activeGameweeks.length > 0 ? activeGameweeks[activeGameweeks.length - 1] : null

    let liveSummary = null
    const videprinterHost = config.get('videprinterHost')
    const videprinterStreamUrl = `${videprinterHost}/videprinter/stream`

    if (activeGameweek) {
      const startDate = new Date(activeGameweek.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)

      try {
        const summaryUrl = `${videprinterHost}/videprinter/summary?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
        const { payload } = await Wreck.get(summaryUrl, { json: true })
        liveSummary = payload
      } catch (err: any) {
        request.log(['warn', 'videprinter'], { msg: 'Failed to fetch live summary', err: err?.message })
        liveSummary = null
      }
    }

    let managers: any[] = []
    try {
      managers = await get('/managers', request) as any[]
    } catch (err: any) {
      request.log(['warn', 'api'], { msg: 'Failed to fetch managers for live view', err: err?.message })
      managers = []
    }

    return h.view('live', {
      gameweek: activeGameweek,
      liveSummary,
      managers,
      videprinterStreamUrl,
    })
  },
}]

export default routes
