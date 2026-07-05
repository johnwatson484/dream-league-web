import { createClient } from 'redis'
import config from '../config.ts'

const client = createClient({
  socket: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
  password: config.get('redis.password') || undefined,
})

client.on('error', (err) => {
  if (!err.message.includes('ECONNREFUSED')) {
    console.error('Session Redis error:', err.message)
  }
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
