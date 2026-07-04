import XLSX from 'xlsx'

export function mapPlayer (worksheet, cellAddress, position, substitute) {
  const player = worksheet[XLSX.utils.encode_cell(cellAddress)]
  return player ? { player: player.v.trim(), position, substitute } : undefined
}
