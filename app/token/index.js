const api = require('../api')

async function validate (decoded, request, h) {
  return api.post('/validate', {
    token: decoded
  })
}

module.exports = {
  validate
}
