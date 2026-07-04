import { createClient } from 'redis'

const client = createClient({
  socket: {
    host: process.env.SESSION_REDIS_HOST || 'localhost',
    port: parseInt(process.env.SESSION_REDIS_PORT || '6380', 10),
  },
  password: process.env.SESSION_REDIS_PASSWORD || undefined,
})

client.on('error', (err) => {
  console.error('Session Redis error:', err.message)
})

export async function connect () {
  if (!client.isOpen) {
    await client.connect()
  }
}

export async function disconnect () {
  if (client.isOpen) {
    await client.disconnect()
  }
}

const KEY_PREFIX = 'dream-league-web:session:'

export async function getSession (sessionId: string) {
  const data = await client.get(`${KEY_PREFIX}${sessionId}`)
  if (!data || typeof data !== 'string') {
    return null
  }
  return JSON.parse(data)
}

export async function setSession (sessionId: string, data: object, ttlSeconds: number) {
  await client.set(`${KEY_PREFIX}${sessionId}`, JSON.stringify(data), { EX: ttlSeconds })
}

export async function deleteSession (sessionId: string) {
  await client.del(`${KEY_PREFIX}${sessionId}`)
}
