# Dream League Web - AI Agent Instructions

## Architecture Overview

This is a **Hapi.js** web frontend that communicates with a separate REST API backend ([dream-league-api](https://github.com/johnwatson484/dream-league-api)). The app is a fantasy football league management system.

**Key components:**
- **Frontend server**: Renders Nunjucks templates, handles auth via JWT cookies
- **Backend API**: Separate service at `http://localhost:3001` (configurable via `API_HOST` env var)
- **No database**: This service is purely presentational - all data lives in the API

## Module System

This project uses **ESM** (`"type": "module"` in package.json). All imports use `import`/`export` syntax with explicit `.js` extensions.

## Critical Development Patterns

### 1. Route Structure Convention
Routes follow a strict pattern - see [src/routes/home.js](../src/routes/home.js):
```javascript
import { GET } from '../constants/verbs.js'
import { get } from '../api/index.js'

export default [{
  method: GET,
  path: '/',
  config: {},
  handler: async (request, h) => {
    const data = await get('/endpoint', request.state.dl_token)
    return h.view('template', { data })
  }
}]
```
- Route modules **export default arrays** of route objects
- Use verb constants from [src/constants/verbs.js](../src/constants/verbs.js)
- JWT token accessed via `request.state.dl_token` cookie
- All routes registered in [src/plugins/router.js](../src/plugins/router.js)

### 2. API Communication
All backend calls use wrappers from [src/api/](../src/api/):
- `get(url, token)` - GET requests
- `post(url, payload, token)` - POST requests
- `del(url, payload, token)` - DELETE requests

**Never** call `@hapi/wreck` directly. Token authentication is handled automatically.

### 3. Authentication & Authorization
- JWT strategy configured in [src/plugins/auth.js](../src/plugins/auth.js)
- Default auth mode is `try` (optional auth for most routes)
- Admin routes require: `options: { auth: { strategy: 'jwt', scope: ['admin'] } }`
- Token validation proxied to API via [src/auth/validate.js](../src/auth/validate.js)

### 4. Excel File Handling
Teamsheet and player data can be bulk-uploaded via Excel files:
- Uses `xlsx` library (see [src/refresh/teamsheet/](../src/refresh/teamsheet/))
- File upload routes need special payload config (see [src/routes/teamsheet.js](../src/routes/teamsheet.js))
- Mapping functions transform spreadsheet data to API format
- Test files in [test/files/](../test/files/)

### 5. View Models
Transform API responses before rendering - see [src/routes/models/teamsheet.js](../src/routes/models/teamsheet.js):
- Ensure fixed array sizes for frontend rendering
- Fill missing entries with default objects (`{ playerId: 0 }`)
- Keep view logic out of Nunjucks templates

## Developer Workflows

### Local Development (host-native)
```bash
nvm use && npm install && cp .env.example .env
npm run local          # starts dev server with --watch
npm run dev:debug      # debug mode (port 9229)
```

Requires [dream-league-api](https://github.com/johnwatson484/dream-league-api) running on `API_HOST` (default `http://localhost:3001`).

### Docker (full containerised mode)
```bash
docker compose --profile app up   # starts web app in container (needs API on dream-league network)
```

### Testing
```bash
npm test               # all tests with coverage
npm run test:unit      # unit tests only
npm run test:integration  # integration tests
npm run test:watch     # watch mode
npm run test:lint      # ESLint
```

**Test patterns:**
- Mock API calls with `vi.mock('../../src/api/index.js')` — see tests in `test/integration/`
- Integration tests verify route behavior and API contract
- Uses **Vitest** with `vi` for mocking

### Code Quality
Uses **neostandard** ESLint config with Vitest globals:
```bash
npm run test:lint
```

## Environment Variables

**Required in production:**
- `JWT_SECRET` - shared secret with API for token validation
- `API_HOST` - backend API URL (default: `http://localhost:3001`)

**Optional:**
- `PORT` - server port (default: 3000)
- `NODE_ENV` - `development` | `test` | `production`
- `APP_NAME` - display name (default: "Dream League")
- Cookie settings: `COOKIE_TTL`, `COOKIE_SAME_SITE`, etc. (see [src/config.js](../src/config.js))

All config validated with Joi schema in [src/config.js](../src/config.js).

## Plugin Registration Order Matters
Server initialization in [src/server.js](../src/server.js) registers plugins in **specific order**:
1. User agent protection
2. `@hapi/scooter` (device detection)
3. `@hapi/inert` (static files)
4. `hapi-auth-jwt2` (before auth plugin)
5. Views (Nunjucks)
6. Content Security Policy
7. Auth strategy
8. Router (registers all routes)
9. Error handling
10. Crumb (CSRF)

Don't reorder without testing - auth and routing dependencies exist.

## Common Gotchas

1. **CSRF tokens**: Most forms need crumb enabled. Disable explicitly for AJAX: `plugins: { crumb: false }`
2. **Joi validation**: Use `failAction` handlers to customize error responses
3. **Alternatives validation**: For optional arrays, use `joi.alternatives().try(joi.array().items(...), joi.number())`
4. **File uploads**: Set `payload.output: 'file'` and `payload.parse: true`
5. **API dependency**: This service cannot function without dream-league-api running. Both must be in same Docker network or API_HOST must be accessible.
