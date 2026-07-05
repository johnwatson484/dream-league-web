import { randomBytes } from 'node:crypto'
import config from '../config.ts'
import { getSession, setSession, deleteSession } from './redis-client.ts'

const SESSION_TTL_SECONDS = Math.floor(config.get('session.ttl') / 1000)

export interface SessionData {
  accessToken: string
  refreshToken: string
  userId: number
  roles: string[]
  accessTokenExpiresAt: number
}

export async function createSession (data: SessionData): Promise<string> {
  const sessionId = randomBytes(32).toString('hex')
  await setSession(sessionId, data, SESSION_TTL_SECONDS)
  return sessionId
}

export async function loadSession (sessionId: string): Promise<SessionData | null> {
  return getSession(sessionId)
}

export async function updateSession (sessionId: string, data: SessionData): Promise<void> {
  await setSession(sessionId, data, SESSION_TTL_SECONDS)
}

export async function destroySession (sessionId: string): Promise<void> {
  await deleteSession(sessionId)
}
