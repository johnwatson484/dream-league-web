const XLSX = require('xlsx')
const fs = require('fs')
const api = require('../../api')

async function refresh (path, token) {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets.ALL
  const teams = XLSX.utils.sheet_to_json(worksheet)
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
  return await api.post('/dream-league/teamsheet/refresh', { teams }, token)
}

module.exports = refresh
