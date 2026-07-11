import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import type { SessionData } from './session-manager.ts'
import config from '../config.ts'
import logger from '../logger.ts'

const redisPassword = config.get('redis.password')

const client: RedisClientType = createClient({
  socket: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
  },
  ...(redisPassword ? { password: redisPassword } : {}),
})

client.on('error', (err: Error) => {
  if (!err.message.includes('ECONNREFUSED')) {
    logger.error('Session Redis error: %s', err.message)
  }
})

export async function connect (): Promise<void> {
  if (!client.isOpen) {
    await client.connect()
  }
}

export async function disconnect (): Promise<void> {
  if (client.isOpen) {
    await client.disconnect()
  }
}

const KEY_PREFIX = 'dream-league-web:session:'

export async function getSession (sessionId: string): Promise<SessionData | null> {
  const data = await client.get(`${KEY_PREFIX}${sessionId}`)
  if (!data || typeof data !== 'string') {
    return null
  }
  return JSON.parse(data) as SessionData
}

export async function setSession (sessionId: string, data: SessionData, ttlSeconds: number): Promise<void> {
  await client.set(`${KEY_PREFIX}${sessionId}`, JSON.stringify(data), { EX: ttlSeconds })
}

export async function deleteSession (sessionId: string): Promise<void> {
  await client.del(`${KEY_PREFIX}${sessionId}`)
}
