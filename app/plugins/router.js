const routes = [].concat(
  require('../routes/home'),
  require('../routes/cookies'),
  require('../routes/identity/register'),
  require('../routes/identity/login'),
  require('../routes/identity/logout'),
  require('../routes/identity/forgot-password'),
  require('../routes/identity/reset-password'),
  require('../routes/league/team'),
  require('../routes/league/player'),
  require('../routes/league/refresh'),
  require('../routes/teamsheet'),
  require('../routes/results'),
  require('../routes/meetings'),
  require('../routes/managers'),
  require('../routes/cups'),
  require('../routes/fixtures'),
  require('../routes/groups'),
  require('../routes/history'),
  require('../routes/api/winners'),
  require('../routes/api/meetings'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
