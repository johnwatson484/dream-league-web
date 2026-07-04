export function getConfiguration (token = '') {
  return {
    headers: {
      Authorization: token,
    },
    json: true,
  }
}
