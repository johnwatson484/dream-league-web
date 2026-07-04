import { get } from '../api/get.ts'
import { GET } from '../constants/verbs.ts'

export default [{
  method: GET,
  path: '/',
  config: {
  },
  handler: async (request, h) => {
    const results = await get('/results', request)
    const topScorers = await get('/statistics/top-scorers', request)
    const form = await get('/statistics/form', request)
    const nextMeeting = await get('/meetings/next', request)

    return h.view('home', { results, topScorers, form, nextMeeting })
  },
}, {
  method: GET,
  path: '/rules',
  config: {
  },
  handler: async (_request, h) => {
    return h.view('rules')
  },
}]
