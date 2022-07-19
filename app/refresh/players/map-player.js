const mapPlayer = (player) => {
  return {
    firstName: player['First Name'] ? player['First Name'].trim() : undefined,
    lastName: player.Surname ? player.Surname.trim() : undefined,
    position: player.Position ? player.Position.trim() : undefined,
    team: player.Club ? player.Club.trim() : undefined
  }
}

module.exports = mapPlayer
