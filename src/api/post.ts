import type { Request } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function post (url: string, data: unknown, request?: Request): Promise<unknown> {
  const { payload } = await Wreck.post(`${config.get('apiHost')}${url}`, {
    payload: data as object,
    ...getConfiguration(request),
  })
  return payload
}
