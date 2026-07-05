import { GK, DEF, MID, FWD } from '../../constants/position-codes.ts'

export function mapPosition (index: number): string {
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
