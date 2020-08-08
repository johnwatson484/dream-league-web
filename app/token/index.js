const api = require('../api')

async function validate (decoded, request, h) {
  const response = await api.post('/validate', {
    token: decoded
  })
  return JSON.parse(response.toString())
}

module.exports = {
  validate
}
