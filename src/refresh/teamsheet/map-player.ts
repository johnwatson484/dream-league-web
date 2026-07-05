import XLSX from 'xlsx'

interface CellAddress {
  c: number
  r: number
}

interface TeamsheetPlayer {
  player: string
  position: string
  substitute: boolean
}

export function mapPlayer (worksheet: XLSX.WorkSheet, cellAddress: CellAddress, position: string, substitute: boolean): TeamsheetPlayer | undefined {
  const player = worksheet[XLSX.utils.encode_cell(cellAddress)] as { v: string } | undefined
  return player ? { player: player.v.trim(), position, substitute } : undefined
}
