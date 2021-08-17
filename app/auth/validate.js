const api = require('../api')

const validate = async (decoded, request, h) => {
  return api.post('/validate', {
    token: decoded
  })
}

module.exports = validate
