const XLSX = require('xlsx')
const fs = require('fs')
const api = require('../../api')

async function refresh (path, token) {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets['DL Teams']
  const teams = XLSX.utils.sheet_to_json(worksheet)
  console.log(teams)
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
  return { success: true }
  // return await api.post('/dream-league/teamsheet/refresh', { teams }, token)
}

module.exports = refresh
