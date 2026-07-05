[![Build Status](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml)

# Dream League Web

Dream League website.

## Prerequisites

- Node.js >= 24 (see `.nvmrc`)

## Local development

```bash
nvm use
npm install
cp .env.example .env   # set API_HOST if API is not on localhost:3001
npm run local          # starts dev server with --watch
```

**Note:** Requires [dream-league-api](https://github.com/johnwatson484/dream-league-api) to be running (default: `http://localhost:3001`).

### Debug mode

```bash
npm run dev:debug      # same as dev but with --inspect (port 9229)
```

## Testing

```bash
npm test               # all tests with coverage
npm run test:unit      # unit tests only
npm run test:integration  # integration tests only
npm run test:watch     # watch mode
npm run test:lint      # ESLint
```

## Docker (full containerised mode)

```bash
docker compose --profile app up    # starts web app in container (needs API network)
```

## Multi-service development

For running the full stack (API + Web), see the [dream-league-core](https://github.com/johnwatson484/dream-league-core) orchestration repo.

## Environment variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment (`development`, `test`, `production`) | `development` | No |
| `PORT` | Server port | `3000` | No |
| `APP_NAME` | Application display name | `Dream League` | No |
| `API_HOST` | Backend API base URL | `http://localhost:3001` | No |
| `COOKIE_NAME` | Session cookie name | `dl_session` | No |
| `COOKIE_PASSWORD` | Session cookie encryption key (min 32 chars) | — | **Yes** |
| `SESSION_TTL` | Session TTL in milliseconds | `604800000` (7 days) | No |
| `COOKIE_TTL` | Cookie consent TTL in milliseconds | `31536000000` (1 year) | No |
| `COOKIE_ENCODING` | Cookie encoding format | `base64json` | No |
| `COOKIE_SAME_SITE` | Cookie SameSite attribute | `Lax` | No |
| `COOKIE_HTTP_ONLY` | Cookie HttpOnly flag | `true` | No |
| `COOKIE_CLEAR_INVALID` | Clear invalid cookies | `false` | No |
| `COOKIE_STRICT_HEADER` | Strict cookie header enforcement | `true` | No |
| `REDIS_HOST` | Redis host for session storage | `localhost` | No |
| `REDIS_PORT` | Redis port | `6380` | No |
| `REDIS_PASSWORD` | Redis password | `''` | No |

Cookie `isSecure` is automatically set to `true` in production and `false` in development/test.
