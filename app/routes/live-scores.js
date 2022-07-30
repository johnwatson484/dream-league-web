
module.exports = [{
  method: 'GET',
  path: '/live-scores',
  options: {
    handler: async (_request, h) => {
      return h.view('live-scores')
    }
  }
}]
