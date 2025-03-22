const XLSX = require('xlsx')
const { post } = require('../../api')
const { deleteFile } = require('../delete-file')
const { mapTeams } = require('./map-teams')

const refresh = async (path, token) => {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets['DL Teams']

  if (!worksheet) {
    return { success: false }
  }

  const teams = mapTeams(worksheet)
  await deleteFile(path)
  return post('/teamsheet/refresh', { teams }, token)
}

module.exports = {
  refresh,
}
