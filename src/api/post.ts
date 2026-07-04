import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function post (url, data, token?) {
  const { payload } = await Wreck.post(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(token),
  })
  return payload
}
