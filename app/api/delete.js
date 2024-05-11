const Wreck = require('@hapi/wreck')
const config = require('../config')
const { getConfiguration } = require('./get-configuration')

const deleteRequest = async (url, data, token) => {
  const { payload } = await Wreck.delete(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(token)
  })
  return payload
}

module.exports = {
  deleteRequest
}
