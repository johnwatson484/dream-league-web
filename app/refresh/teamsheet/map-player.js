const XLSX = require('xlsx')

const mapPlayer = (worksheet, cellAddress, position, substitute) => {
  const player = worksheet[XLSX.utils.encode_cell(cellAddress)]
  return player ? { player: player.v.trim(), position, substitute } : undefined
}

module.exports = {
  mapPlayer,
}
