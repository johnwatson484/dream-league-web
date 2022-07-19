const wreck = require('@hapi/wreck')
const config = require('../config')
const getConfiguration = require('./get-configuration')

const post = async (url, data, token) => {
  const { payload } = await wreck.post(`${config.apiHost}${url}`, {
    payload: data,
    ...getConfiguration(token)
  })
  return payload
}

module.exports = post
