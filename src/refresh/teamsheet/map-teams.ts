import XLSX from 'xlsx'
import { mapTeam } from './map-team.ts'

interface Team {
  manager: string
  players: { player: string; position: string; substitute: boolean }[]
}

export function mapTeams (worksheet: XLSX.WorkSheet): Team[] {
  const teams: Team[] = []
  const range = XLSX.utils.decode_range(worksheet['!ref'] as string)

  for (let C = 1; C <= range.e.c; ++C) {
    const managerTopAddress = { c: C, r: 0 }
    const managerBottomAddress = { c: C, r: 35 }

    const managerTop = worksheet[XLSX.utils.encode_cell(managerTopAddress)] as { v: string } | undefined
    const managerBottom = worksheet[XLSX.utils.encode_cell(managerBottomAddress)] as { v: string } | undefined

    if (managerTop) {
      const team = mapTeam(worksheet, managerTop.v, managerTopAddress)
      teams.push(team)
    }
    if (managerBottom) {
      const team = mapTeam(worksheet, managerBottom.v, managerBottomAddress)
      teams.push(team)
    }
  }

  return teams
}
