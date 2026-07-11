import { createServer } from './server.ts'
import logger from './logger.ts'

const server = await createServer()
await server.start()
logger.info(`Server started at http://localhost:${server.info.port}`)
