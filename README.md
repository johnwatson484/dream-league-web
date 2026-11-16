[![Build Status](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-web)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=bugs)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-web)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-web)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-web)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=coverage)](https://sonarcloud.io/summary/new_code?id=johnwatson484_dream-league-web)
[![Dependabot](https://badgen.net/github/dependabot/johnwatson484/dream-league-web)](https://github.com/johnwatson484/dream-league-web/security/dependabot)

# Dream League Web

Dream League website.

## Prerequisites

- Node.js >= 26 (see `.nvmrc`)

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
| `SITE_URL` | Website origin for canonical URLs, site-name metadata and the sitemap; set to the public HTTPS origin when deploying | `http://localhost:3000` | No |
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
| `VIDEPRINTER_HOST` | Videprinter service base URL | `http://localhost:3002` | No |
| `VIDEPRINTER_API_KEY` | API key sent to the videprinter service for admin actions (e.g. goal rematch). Must match `API_KEY` in dream-league-videprinter | `''` | No |

Cookie `isSecure` is automatically set to `true` in production and `false` in development/test.

## Search visibility

The site name and homepage tab title remain **Dream League**. Other public pages use
descriptive titles such as `Teamsheet | Dream League`; “fantasy football” describes
the competition in page content and search descriptions.

`SITE_URL` supplies the public origin for canonical URLs, homepage `WebSite`
structured data, `/robots.txt` and `/sitemap.xml`. It defaults to
`http://localhost:3000` for local development. Set `SITE_URL` to the public HTTPS
origin in deployed environments, for example `https://dreamleaguefantasyfootball.co.uk`.
If using a different local port, set `SITE_URL` to match it. This setting does not
change the server's listening port. The request Host header is never used to
generate these URLs.

The sitemap lists the main public destinations. Individual gameweeks, players,
clubs, managers and cups retain their own canonical URLs and can be discovered
through page links. Login, editing and reporting forms, filtered player/club
listings, manager comparison combinations and error pages use `noindex, follow`.
Robots instructions permit crawling so search engines can read those directives.

After deployment:

1. Verify the domain property in Google Search Console, submit `/sitemap.xml`, and
   inspect the homepage, results, teamsheet, live scores and rules pages.
2. Check HTTP/HTTPS, www/non-www and any legacy-domain redirects at the hosting
   layer. Use permanent redirects to the preferred HTTPS domain, preserving paths
   and query strings. This application does not force hostname redirects locally.
3. Check the Google Play app's website link, currently listed as
   `www.dreamleague.eu`, and update it to the preferred website in Play Console if
   appropriate. This requires access to the app's listing.
4. Record Search Console clicks, impressions, click-through rate and average
   position for league-name searches before rollout; compare over 8–12 weeks.
5. Run PageSpeed Insights on representative mobile pages. Fingerprinted CSS and
   JavaScript can now be cached for a year on anonymous requests; HTML remains `no-cache`. The two
   decorative homepage photos load lazily. Other asset changes should follow
   measurements.

## Admin: refreshing live goals

Admins see a "Refresh goals" button on the `/live` page. It calls `POST /live/refresh`, which asks
dream-league-videprinter to re-fetch current teamsheets and rematch every stored goal event - useful
when a goal was scored before a manager's teamsheet was corrected. Requires `VIDEPRINTER_API_KEY` to be
set and to match the videprinter's `API_KEY`.
