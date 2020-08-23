const XLSX = require('xlsx')

async function refresh (path) {
  console.log(path)
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets.ALL
  const players = XLSX.utils.sheet_to_json(worksheet)
  console.log(players)
}

module.exports = refresh
