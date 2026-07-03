import Wreck from '@hapi/wreck'
import config from '../config.js'
import { getConfiguration } from './get-configuration.js'

const deleteRequest = async (url, data, token) => {
  const { payload } = await Wreck.delete(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(token),
  })
  return payload
}

export { deleteRequest }
