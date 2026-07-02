import { readFileSync } from 'fs'
import XLSX from 'xlsx'
import { post } from '../../api/index.js'
import { deleteFile } from '../delete-file.js'
import { mapPlayer } from './map-player.js'

const refresh = async (path, token) => {
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

export { refresh }
