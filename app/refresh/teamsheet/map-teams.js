const XLSX = require('xlsx')
const { mapTeam } = require('./map-team')

const mapTeams = (worksheet) => {
  const teams = []
  const range = XLSX.utils.decode_range(worksheet['!ref'])

  for (let C = 1; C <= range.e.c; ++C) {
    const managerTopAddress = { c: C, r: 0 }
    const managerBottomAddress = { c: C, r: 35 }

    const managerTop = worksheet[XLSX.utils.encode_cell(managerTopAddress)]
    const managerBottom = worksheet[XLSX.utils.encode_cell(managerBottomAddress)]

    if (managerTop) {
      const team = mapTeam(worksheet, managerTop.v, managerTopAddress)
      teams.push(team)
    }
    if (managerBottom) {
      const team = mapTeam(worksheet, managerBottom.v, managerBottomAddress)
      teams.push(team)
    }
  }

  return teams
}

module.exports = {
  mapTeams
}
