import { readFileSync } from 'fs'
import XLSX from 'xlsx'
import { post } from '../../api/index.js'
import { deleteFile } from '../delete-file.js'
import { mapTeams } from './map-teams.js'

const refresh = async (path, token) => {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets['DL Teams']

  if (!worksheet) {
    return { success: false }
  }

  const teams = mapTeams(worksheet)
  await deleteFile(path)
  return post('/teamsheet/refresh', { teams }, token)
}

export { refresh }
