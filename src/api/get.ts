import Wreck from '@hapi/wreck'
import config from '../config.ts'
import { getConfiguration } from './get-configuration.ts'

export async function get (url, request?) {
  const { payload } = await Wreck.get(`${config.get('apiHost')}${url}`, getConfiguration(request))
  return payload
}
