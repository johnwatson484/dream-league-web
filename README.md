[![Build Status](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml)

# Dream League Web

Dream League website (server-rendered Nunjucks frontend).

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
