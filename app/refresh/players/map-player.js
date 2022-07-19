const mapPlayer = (player) => {
  return {
    firstName: player['First Name'].trim(),
    lastName: player.Surname.trim(),
    position: player.Position.trim(),
    team: player.Club.trim()
  }
}

module.exports = mapPlayer
