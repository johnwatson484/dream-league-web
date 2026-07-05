import type { Plugin, ServerOptions, ServerRoute } from '@hapi/hapi'
import home from '../routes/home.ts'
import cookies from '../routes/cookies.ts'
import register from '../routes/identity/register.ts'
import login from '../routes/identity/login.ts'
import logout from '../routes/identity/logout.ts'
import forgotPassword from '../routes/identity/forgot-password.ts'
import resetPassword from '../routes/identity/reset-password.ts'
import team from '../routes/league/team.ts'
import player from '../routes/league/player.ts'
import refresh from '../routes/league/refresh.ts'
import teamsheet from '../routes/teamsheet.ts'
import results from '../routes/results.ts'
import goals from '../routes/goals.ts'
import conceded from '../routes/conceded.ts'
import meetings from '../routes/meetings.ts'
import managers from '../routes/managers.ts'
import cups from '../routes/cups.ts'
import fixtures from '../routes/fixtures.ts'
import groups from '../routes/groups.ts'
import history from '../routes/history.ts'
import search from '../routes/search.ts'
import apiWinners from '../routes/api/winners.ts'
import apiMeetings from '../routes/api/meetings.ts'
import apiManagers from '../routes/api/managers.ts'
import publicRoutes from '../routes/public.ts'

const routes: ServerRoute[] = [
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

const plugin: Plugin<ServerOptions> = {
  name: 'router',
  register: (server) => {
    server.route(routes)
  },
}

export default { plugin }
