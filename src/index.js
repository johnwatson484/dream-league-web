import { createServer } from './server.js'

const server = await createServer()
await server.start()
console.log(`Server started at http://localhost:${server.info.port}`)
