const XLSX = require('xlsx')
const fs = require('fs')
const api = require('../../api')

async function refresh (path, token) {
  const workbook = XLSX.readFile(path)
  const worksheet = workbook.Sheets['DL Teams']
  const range = XLSX.utils.decode_range(worksheet['!ref'])

  const teams = []

  function mapPlayer (cellAddress, position, substitute) {
    const player = worksheet[XLSX.utils.encode_cell(cellAddress)]
    return player ? { player: player.v.trim(), position, substitute } : undefined
  }

  function mapTeam (manager, cellAddress) {
    const margin = 3
    const increment = 2
    const totalPlayers = 15
    let r = cellAddress.r + margin

    const players = []

    for (let i = 0; i < totalPlayers; i++) {
      const position = mapPosition(i)
      const substitute = mapSubstitute(i)

      const player = mapPlayer({ c: cellAddress.c, r }, position, substitute)
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

  for (let C = 1; C <= range.e.c; ++C) {
    const managerTopAddress = { c: C, r: 0 }
    const managerBottomAddress = { c: C, r: 35 }

    const managerTop = worksheet[XLSX.utils.encode_cell(managerTopAddress)]
    const managerBottom = worksheet[XLSX.utils.encode_cell(managerBottomAddress)]

    if (managerTop) {
      const team = mapTeam(managerTop.v, managerTopAddress)
      teams.push(team)
    }
    if (managerBottom) {
      const team = mapTeam(managerBottom.v, managerBottomAddress)
      teams.push(team)
    }
  }
  fs.unlink(path, (err) => {
    if (err) console.error(err)
  })
  return await api.post('/dream-league/teamsheet/refresh', { teams }, token)
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

module.exports = refresh
