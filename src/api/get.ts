import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function get (url, token?) {
  const { payload } = await Wreck.get(`${config.apiHost}${url}`, getConfiguration(token))
  return payload
}
