import { readFileSync } from 'node:fs'
import XLSX from 'xlsx'
import { post } from '../../api/post.ts'
import { deleteFile } from '../delete-file.ts'
import { mapPlayer } from './map-player.ts'

export async function refreshPlayers (path, token?) {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets.ALL

  if (!worksheet) {
    return { success: false }
  }

  const players = XLSX.utils.sheet_to_json(worksheet)
  await deleteFile(path)
  const mappedPlayers = players.map(mapPlayer)
  return post('/league/players/refresh', { players: mappedPlayers }, token)
}
