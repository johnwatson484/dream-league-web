import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function deleteRequest (url, data, request?) {
  const { payload } = await Wreck.delete(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(request),
  })
  return payload
}
