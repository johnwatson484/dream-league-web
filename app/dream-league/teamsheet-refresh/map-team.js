const XLSX = require('xlsx')

function mapTeams (worksheet) {
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

function mapPosition (index) {
  if (index <= 1) {
    return 'GK'
  }
  if (index <= 4) {
    return 'DEF'
  }
  if (index <= 8) {
    return 'MID'
  }
  return 'FWD'
}

function mapSubstitute (index) {
  const substitutes = [1, 4, 8, 14]
  return substitutes.includes(index)
}

function mapTeam (worksheet, manager, cellAddress) {
  const margin = 3
  const increment = 2
  const totalPlayers = 15
  let r = cellAddress.r + margin

  const players = []

  for (let i = 0; i < totalPlayers; i++) {
    const position = mapPosition(i)
    const substitute = mapSubstitute(i)

    const player = mapPlayer(worksheet, { c: cellAddress.c, r }, position, substitute)
    if (player) {
      players.push(player)
    }
    r += increment
  }

  return {
    manager: manager.trim(),
    players
  }
}

function mapPlayer (worksheet, cellAddress, position, substitute) {
  const player = worksheet[XLSX.utils.encode_cell(cellAddress)]
  return player ? { player: player.v.trim(), position, substitute } : undefined
}

module.exports = mapTeams
