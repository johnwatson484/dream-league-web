const routes = [].concat(
  require('../routes/home'),
  require('../routes/identity/register'),
  require('../routes/identity/login'),
  require('../routes/identity/logout'),
  require('../routes/league/team'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
