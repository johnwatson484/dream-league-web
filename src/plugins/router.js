import home from '../routes/home.js'
import cookies from '../routes/cookies.js'
import register from '../routes/identity/register.js'
import login from '../routes/identity/login.js'
import logout from '../routes/identity/logout.js'
import forgotPassword from '../routes/identity/forgot-password.js'
import resetPassword from '../routes/identity/reset-password.js'
import team from '../routes/league/team.js'
import player from '../routes/league/player.js'
import refresh from '../routes/league/refresh.js'
import teamsheet from '../routes/teamsheet.js'
import results from '../routes/results.js'
import goals from '../routes/goals.js'
import conceded from '../routes/conceded.js'
import meetings from '../routes/meetings.js'
import managers from '../routes/managers.js'
import cups from '../routes/cups.js'
import fixtures from '../routes/fixtures.js'
import groups from '../routes/groups.js'
import history from '../routes/history.js'
import search from '../routes/search.js'
import apiWinners from '../routes/api/winners.js'
import apiMeetings from '../routes/api/meetings.js'
import apiManagers from '../routes/api/managers.js'
import publicRoutes from '../routes/public.js'

const routes = [
  ...home,
  ...cookies,
  ...register,
  ...login,
  ...logout,
  ...forgotPassword,
  ...resetPassword,
  ...team,
  ...player,
  ...refresh,
  ...teamsheet,
  ...results,
  ...goals,
  ...conceded,
  ...meetings,
  ...managers,
  ...cups,
  ...fixtures,
  ...groups,
  ...history,
  ...search,
  ...apiWinners,
  ...apiMeetings,
  ...apiManagers,
  ...publicRoutes,
]

export default {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    },
  },
}
