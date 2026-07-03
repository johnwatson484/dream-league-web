import { post } from '../api/index.js'

const validate = async (decoded, _request, _h) => {
  return post('/validate', {
    token: decoded,
  })
}

export { validate }
