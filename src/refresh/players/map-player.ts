interface RawPlayer {
  'First Name'?: string
  Surname?: string
  Position?: string
  Club?: string
}

interface MappedPlayer {
  firstName: string | undefined
  lastName: string | undefined
  position: string | undefined
  team: string | undefined
}

export function mapPlayer (player: RawPlayer): MappedPlayer {
  return {
    firstName: player['First Name'] ? player['First Name'].trim() : undefined,
    lastName: player.Surname ? player.Surname.trim() : undefined,
    position: player.Position ? player.Position.trim() : undefined,
    team: player.Club ? player.Club.trim() : undefined,
  }
}
