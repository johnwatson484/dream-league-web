import { pino } from 'pino'
import config from './config.ts'

const logger = pino({
  level: config.get('logLevel'),
})

export default logger
