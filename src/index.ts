import { createServer } from './server.ts'

const server = await createServer()
await server.start()
server.log(['info'], `Server started at ${server.info.uri}`)
