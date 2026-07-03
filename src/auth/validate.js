import { post } from '../api/post.js'

export async function validate (decoded, _request, _h) {
  return post('/validate', {
    token: decoded,
  })
}
