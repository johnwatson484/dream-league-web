const getConfiguration = (token = '') => {
  return {
    headers: {
      Authorization: token,
    },
    json: true,
  }
}

export { getConfiguration }
