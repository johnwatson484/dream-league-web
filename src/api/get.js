import Wreck from '@hapi/wreck'
import config from '../config.js'
import { getConfiguration } from './get-configuration.js'

export async function get (url, token) {
  const { payload } = await Wreck.get(`${config.apiHost}${url}`, getConfiguration(token))
  return payload
}
