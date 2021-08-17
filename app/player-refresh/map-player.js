const mapPlayer = (player) => {
  return {
    firstName: player['First Name'],
    lastName: player.Surname,
    position: player.Position,
    team: player.Club
  }
}

module.exports = mapPlayer
