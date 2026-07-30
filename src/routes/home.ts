import type { ServerRoute } from '@hapi/hapi'
import { get } from '../api/get.ts'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const results = await get('/results', request) as any

    if (results.gameweekId) {
      const topScorers = await get('/statistics/top-scorers', request)
      const form = await get('/statistics/form', request)
      const nextMeeting = await get('/meetings/next', request)
      return h.view('home', { results, topScorers, form, nextMeeting })
    }

    const upcoming = await get('/season/upcoming', request)
    return h.view('home', { results, upcoming })
  },
}, {
  method: 'GET',
  path: '/rules',
  handler: async (_request, h) => {
    return h.view('rules')
  },
}]

export default routes
