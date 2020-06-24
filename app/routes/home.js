module.exports = [{
  method: 'GET',
  path: '/',
  config: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: (request, h) => {
    console.log(request.auth)
    return h.view('home')
  }
}]
