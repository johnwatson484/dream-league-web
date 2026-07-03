import { readFileSync } from 'node:fs'
import XLSX from 'xlsx'
import { post } from '../../api/post.js'
import { deleteFile } from '../delete-file.js'
import { mapTeams } from './map-teams.js'

export async function refreshTeamsheet (path, token) {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets['DL Teams']

  if (!worksheet) {
    return { success: false }
  }

  const teams = mapTeams(worksheet)
  await deleteFile(path)
  return post('/teamsheet/refresh', { teams }, token)
}
