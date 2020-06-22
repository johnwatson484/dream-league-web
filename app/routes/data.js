module.exports = [{
  method: 'GET',
  path: '/data',
  handler: (request, h) => {
    return h.view('success')
  }
}]
