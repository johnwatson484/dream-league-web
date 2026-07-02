import { createServer } from './server.js'

const server = await createServer()
await server.start()
