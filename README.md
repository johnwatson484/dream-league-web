[![Build Status](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml/badge.svg)](https://github.com/johnwatson484/dream-league-web/actions/workflows/build.yaml)
# Dream League Web
Dream League website

# Prerequisites
- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

## Running the application
The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

## Run production application in container with Docker

```
docker compose build
docker compose up
```

## Develop application in container

This service is dependent on the availability of [Dream League API](https://github.com/johnwatson484/dream-league-api) running in the same Docker network.

Running `docker compose up` in each repository will start the services in the same network.

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `compose.yaml` and `compose.test.yaml`.
The command given to `docker compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

