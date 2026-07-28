import type { ServerRoute } from '@hapi/hapi'
import { get } from '../api/get.ts'
import groupWinnersByGameweek from './models/weekly-winners.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/weekly-winners',
  handler: async (request, h) => {
    const winners = await get('/winners', request) as any[]
    const weeklyWinners = groupWinnersByGameweek(winners)
    return h.view('weekly-winners', { weeklyWinners })
  },
}]

export default routes
