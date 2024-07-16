const { post } = require('../api')

const validate = async (decoded, _request, _h) => {
  return post('/validate', {
    token: decoded,
  })
}

module.exports = {
  validate,
}
