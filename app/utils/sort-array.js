const sortArray = (a, b) => {
  const order = a < b ? -1 : 1
  return a === b ? 0 : order
}

module.exports = {
  sortArray,
}
