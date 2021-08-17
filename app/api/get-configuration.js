const getConfiguration = (token = '') => {
  return {
    headers: {
      Authorization: token
    },
    json: true
  }
}

module.exports = getConfiguration
