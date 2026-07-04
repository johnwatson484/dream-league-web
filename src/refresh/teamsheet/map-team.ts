import { mapPlayer } from './map-player.ts'
import { mapPosition } from './map-position.ts'
import { mapSubstitute } from './map-substitute.ts'

export function mapTeam (worksheet, manager, cellAddress) {
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
    players,
  }
}
