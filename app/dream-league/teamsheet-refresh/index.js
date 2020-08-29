const XLSX = require('xlsx')
const fs = require('fs')
const api = require('../../api')
const mapTeams = require('./map-team')

async function refresh (path, token) {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets['DL Teams']
  const teams = mapTeams(worksheet)
  deleteFile(path)
  return await api.post('/dream-league/teamsheet/refresh', { teams }, token)
}

function deleteFile (path) {
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
}

module.exports = refresh
