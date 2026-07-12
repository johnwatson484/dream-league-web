import type { Request } from '@hapi/hapi'
import { readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import XLSX from 'xlsx'
import { post } from '../../api/post.ts'
import { mapPlayer } from './map-player.ts'

export async function refreshPlayers (path: string, token?: Request): Promise<unknown> {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets.ALL

  if (!worksheet) {
    return { success: false }
  }

  const players = XLSX.utils.sheet_to_json(worksheet) as Parameters<typeof mapPlayer>[0][]
  await unlink(path)
  const mappedPlayers = players.map(mapPlayer)
  return post('/league/players/refresh/preview', { players: mappedPlayers }, token)
}
