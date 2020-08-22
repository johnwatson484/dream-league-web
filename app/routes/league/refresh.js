module.exports = [{
  method: 'GET',
  path: '/league/refresh',
  handler: async (request, h) => {
    return h.view('league/refresh')
  }
}, {
  method: 'POST',
  path: '/league/refresh/players',
  options: {
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true
    },
    handler: async (request, h) => {
      console.log(request.payload)
      return h.redirect('/league/players')
    }
  }
}]
