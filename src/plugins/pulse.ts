import hapiPulse from 'hapi-pulse'
import config from '../config.ts'
import logger from '../logger.ts'

const tenSeconds = 10 * 1000
const oneSecond = 1 * 1000

const pulse = {
  plugin: hapiPulse,
  options: {
    logger,
    timeout: config.get('isDev') ? oneSecond : tenSeconds
  }
}

export default pulse
