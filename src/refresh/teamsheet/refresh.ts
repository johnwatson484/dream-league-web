import type { Request } from '@hapi/hapi'
import { readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import XLSX from 'xlsx'
import { post } from '../../api/post.ts'
import { mapTeams } from './map-teams.ts'

export async function refreshTeamsheet (path: string, token?: Request): Promise<unknown> {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets['DL Teams']

  if (!worksheet) {
    return { success: false }
  }

  const teams = mapTeams(worksheet)
  await unlink(path)
  return post('/teamsheet/refresh', { teams }, token)
}
