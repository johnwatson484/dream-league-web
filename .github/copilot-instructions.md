# Dream League Web - AI Agent Instructions

## Architecture Overview

This is a **Hapi.js** web frontend that communicates with a separate REST API backend ([dream-league-api](https://github.com/johnwatson484/dream-league-api)). The app is a fantasy football league management system.

**Key components:**
- **Frontend server**: Renders Nunjucks templates, handles auth via JWT cookies
- **Backend API**: Separate service at `http://dream-league-api:3001` (Docker) or configurable via `API_HOST` env var
- **No database**: This service is purely presentational - all data lives in the API

## Critical Development Patterns

### 1. Route Structure Convention
Routes follow a strict pattern - see [app/routes/home.js](app/routes/home.js):
```javascript
module.exports = [{
  method: GET,  // imported from constants/verbs
  path: '/',
  config: {},  // auth options go here
  handler: async (request, h) => {
    const data = await get('/endpoint', request.state.dl_token)
    return h.view('template', { data })
  }
}]
```
- Route modules **export arrays** of route objects
- Use verb constants from [app/constants/verbs.js](app/constants/verbs.js)
- JWT token accessed via `request.state.dl_token` cookie
- All routes registered in [app/plugins/router.js](app/plugins/router.js)

### 2. API Communication
All backend calls use wrappers from [app/api/](app/api/):
- `get(url, token)` - GET requests
- `post(url, payload, token)` - POST requests  
- `del(url, payload, token)` - DELETE requests

**Never** call `@hapi/wreck` directly. Token authentication is handled automatically.

### 3. Authentication & Authorization
- JWT strategy configured in [app/plugins/auth.js](app/plugins/auth.js)
- Default auth mode is `try` (optional auth for most routes)
- Admin routes require: `options: { auth: { strategy: 'jwt', scope: ['admin'] } }`
- Token validation proxied to API via [app/auth/validate.js](app/auth/validate.js)

### 4. Excel File Handling
Teamsheet and player data can be bulk-uploaded via Excel files:
- Uses `xlsx` library (see [app/refresh/teamsheet/](app/refresh/teamsheet/))
- File upload routes need special payload config (see [app/routes/teamsheet.js](app/routes/teamsheet.js#L72-L80))
- Mapping functions transform spreadsheet data to API format
- Test files in [test/files/](test/files/)

### 5. View Models
Transform API responses before rendering - see [app/routes/models/teamsheet.js](app/routes/models/teamsheet.js):
- Ensure fixed array sizes for frontend rendering
- Fill missing entries with default objects (`{ playerId: 0 }`)
- Keep view logic out of Nunjucks templates

## Development Workflow

### Running Locally (Dockerized)
```bash
# Start both web and API services (requires dream-league-api repo)
docker compose up

# Debug mode (port 9229 exposed)
docker compose -f compose.yaml -f compose.override.yaml -f compose.debug.yaml up -d

# Or use VS Code tasks: compose-debug-up / compose-debug-down
```

### Testing
```bash
# Run all tests in container
./scripts/test

# Watch mode
./scripts/test -w

# Inside container or local dev
npm test                # all tests
npm run test:integration
npm run test:unit
npm run test:watch
npm run test:debug      # debug on 0.0.0.0:9229
```

**Test patterns:**
- Mock API calls with `jest.mock('../../app/api')` - see [test/integration/teamsheet-refresh.test.js](test/integration/teamsheet-refresh.test.js)
- Integration tests verify route behavior and API contract
- Use `runInBand` and `forceExit` flags (required for Hapi server cleanup)

### Linting
Uses **neostandard** (modern ESLint config):
```bash
npm run test:lint
```
Globals defined in [eslint.config.js](eslint.config.js) include Jest (`describe`, `test`, `expect`) and browser (`$`, `dataLayer`).

## Environment Variables

**Required in production:**
- `JWT_SECRET` - shared secret with API for token validation
- `API_HOST` - backend API URL (default: `http://localhost:3001`)

**Optional:**
- `PORT` - server port (default: 3000)
- `NODE_ENV` - `development` | `test` | `production`
- `APP_NAME` - display name (default: "Dream League")
- Cookie settings: `COOKIE_TTL`, `COOKIE_SAME_SITE`, etc. (see [app/config.js](app/config.js))

All config validated with Joi schema in [app/config.js](app/config.js).

## Plugin Registration Order Matters
Server initialization in [app/server.js](app/server.js) registers plugins in **specific order**:
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
2. **Joi validation**: Use `failAction` handlers to customize error responses - see [app/routes/teamsheet.js](app/routes/teamsheet.js#L33-L36)
3. **Alternatives validation**: For optional arrays, use `joi.alternatives().try(joi.array().items(...), joi.number())`
4. **File uploads**: Set `payload.output: 'file'` and `payload.parse: true` - example in [app/routes/teamsheet.js](app/routes/teamsheet.js#L72)
5. **API dependency**: This service cannot function without dream-league-api running. Both must be in same Docker network or API_HOST must be accessible.
