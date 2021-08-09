const routes = [].concat(
  require('../routes/home'),
  require('../routes/cookies'),
  require('../routes/identity/register'),
  require('../routes/identity/login'),
  require('../routes/identity/logout'),
  require('../routes/league/team'),
  require('../routes/league/player'),
  require('../routes/league/refresh'),
  require('../routes/dream-league/teamsheet'),
  require('../routes/dream-league/results'),
  require('../routes/dream-league/meetings'),
  require('../routes/dream-league/managers'),
  require('../routes/dream-league/cups'),
  require('../routes/dream-league/fixtures'),
  require('../routes/dream-league/groups'),
  require('../routes/dream-league/history'),
  require('../routes/api/winners'),
  require('../routes/api/meetings'),
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
