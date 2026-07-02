import Wreck from '@hapi/wreck'
import config from '../config.js'
import { getConfiguration } from './get-configuration.js'

const post = async (url, data, token) => {
  const { payload } = await Wreck.post(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(token),
  })
  return payload
}

export { post }
