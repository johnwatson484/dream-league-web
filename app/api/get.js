const Wreck = require('@hapi/wreck')
const config = require('../config')
const { getConfiguration } = require('./get-configuration')

const get = async (url, token) => {
  const { payload } = await Wreck.get(`${config.apiHost}${url}`, getConfiguration(token))
  return payload
}

module.exports = {
  get
}
