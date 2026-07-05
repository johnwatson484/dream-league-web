import XLSX from 'xlsx'
import type { CellAddress, TeamsheetPlayer } from './types.ts'

export function mapPlayer (worksheet: XLSX.WorkSheet, cellAddress: CellAddress, position: string, substitute: boolean): TeamsheetPlayer | undefined {
  const player = worksheet[XLSX.utils.encode_cell(cellAddress)] as { v: string } | undefined
  return player ? { player: player.v.trim(), position, substitute } : undefined
}
