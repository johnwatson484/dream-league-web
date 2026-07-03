import { GK, DEF, MID, FWD } from '../../constants/position-codes.js'

export function mapPosition (index) {
  if (index <= 1) {
    return GK
  }
  if (index <= 4) {
    return DEF
  }
  if (index <= 8) {
    return MID
  }
  return FWD
}
