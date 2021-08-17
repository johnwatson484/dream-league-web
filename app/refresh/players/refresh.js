const XLSX = require('xlsx')
const api = require('../../api')
const deleteFile = require('../delete-file')
const mapPlayer = require('./map-player')

const refresh = async (path, token) => {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets.ALL
  const players = XLSX.utils.sheet_to_json(worksheet)
  deleteFile(path)
  const mappedPlayers = players.map(mapPlayer)
  return api.post('/league/players/refresh', { players: mappedPlayers }, token)
}

module.exports = refresh
