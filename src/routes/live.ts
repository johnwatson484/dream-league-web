import type { ServerRoute } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import { get } from '../api/get.ts'
import config from '../config.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/live',
  handler: async (request, h) => {
    const gameweeks = await get('/gameweeks', request) as any[]
    const activeGameweek = gameweeks.find((gw: any) => gw.isActive)

    let liveSummary = null
    let videprinterStreamUrl = ''

    if (activeGameweek) {
      const startDate = new Date(activeGameweek.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)

      const videprinterHost = config.get('videprinterHost')
      videprinterStreamUrl = `${videprinterHost}/videprinter/stream`

      try {
        const summaryUrl = `${videprinterHost}/videprinter/summary?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
        const { payload } = await Wreck.get(summaryUrl, { json: true })
        liveSummary = payload
      } catch {
        liveSummary = null
      }
    }

    const managers = await get('/managers', request) as any[]
    const teamsheet = await get('/teamsheet', request) as any

    return h.view('live', {
      gameweek: activeGameweek,
      liveSummary,
      managers,
      teamsheet,
      videprinterStreamUrl,
    })
  },
}]

export default routes
