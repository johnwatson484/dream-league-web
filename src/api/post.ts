import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function post (url, data, request?) {
  const { payload } = await Wreck.post(`${config.get('apiHost')}${url}`, {
    payload: data,
    ...getConfiguration(request),
  })
  return payload
}
