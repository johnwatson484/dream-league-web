const { GK, DEF, MID, FWD } = require('../../constants/position-codes')

const mapPosition = (index) => {
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

module.exports = {
  mapPosition,
}
