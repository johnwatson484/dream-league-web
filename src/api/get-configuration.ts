export function getConfiguration (request?) {
  let token = ''

  if (request?.app?.session?.accessToken) {
    token = request.app.session.accessToken
  }

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    json: true,
  }
}
