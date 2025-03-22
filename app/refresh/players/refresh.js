const XLSX = require('xlsx')
const { post } = require('../../api')
const { deleteFile } = require('../delete-file')
const { mapPlayer } = require('./map-player')

const refresh = async (path, token) => {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets.ALL

  if (!worksheet) {
    return { success: false }
  }

  const players = XLSX.utils.sheet_to_json(worksheet)
  await deleteFile(path)
  const mappedPlayers = players.map(mapPlayer)
  return post('/league/players/refresh', { players: mappedPlayers }, token)
}

module.exports = {
  refresh,
}
