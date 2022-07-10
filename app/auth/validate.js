const api = require('../api')

const validate = async (decoded, _request, _h) => {
  return api.post('/validate', {
    token: decoded
  })
}

module.exports = validate
