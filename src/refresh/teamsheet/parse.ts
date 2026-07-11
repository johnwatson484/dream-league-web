import { readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import XLSX from 'xlsx'
import { mapTeams } from './map-teams.ts'

export async function parseTeamsheet (path: string): Promise<unknown[] | null> {
  const workbook = XLSX.read(readFileSync(path))
  const worksheet = workbook.Sheets['DL Teams']

  await unlink(path)

  if (!worksheet) {
    return null
  }

  return mapTeams(worksheet)
}
