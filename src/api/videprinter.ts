import Wreck from '@hapi/wreck'
import config from '../config.ts'

const REMATCH_TIMEOUT_MS = 15000

export interface RematchSummary {
  eventsProcessed: number
  eventsChanged: number
  unmatched: number
  teamsheet: unknown
}

export async function triggerGoalRematch (): Promise<RematchSummary> {
  const url = `${config.get('videprinterHost')}/videprinter/rematch`
  const { payload } = await Wreck.post(url, {
    json: true,
    timeout: REMATCH_TIMEOUT_MS,
    headers: { 'x-api-key': config.get('videprinterApiKey') },
  })
  return payload as RematchSummary
}
