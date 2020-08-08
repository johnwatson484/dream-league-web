module.exports = [{
  method: 'GET',
  path: '/',
  config: {
  },
  handler: (request, h) => {
    return h.view('home')
  }
}]
