import { post } from '../api/post.ts'

export async function validate (decoded, request, _h) {
  return post('/validate', {
    token: request.state.dl_token,
  })
}
