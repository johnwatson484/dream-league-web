import type { Request } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function deleteRequest (url: string, data: unknown, request?: Request): Promise<unknown> {
  const { payload } = await Wreck.delete(`${config.get('apiHost')}${url}`, {
    payload: data as object,
    ...getConfiguration(request),
  })
  return payload
}
