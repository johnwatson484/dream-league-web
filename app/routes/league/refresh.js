module.exports = [{
  method: 'GET',
  path: '/league/refresh',
  handler: (request, h) => {
    return h.view('league/refresh')
  }
}, {
  method: 'POST',
  path: '/league/refresh/players',
  options: {
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      timeout: false
    },
    handler: (request, h) => {
      console.log(request.payload)
      return h.redirect('/league/players')
    }
  }
}]
