const XLSX = require('xlsx')
const fs = require('fs')
const api = require('../../api')

async function refresh (path, token) {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets.ALL
  const players = XLSX.utils.sheet_to_json(worksheet)
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
  const mappedPlayers = players.map(mapPlayer)
  return await api.post('/league/players/refresh', { players: mappedPlayers }, token)
}

function mapPlayer (player) {
  return {
    firstName: player['First Name'],
    lastName: player.Surname,
    position: player.Position,
    team: player.Club
  }
}

module.exports = refresh
