[![Build Status](https://dev.azure.com/johnwatson484/John%20D%20Watson/_apis/build/status/Dream%20League%20Web?branchName=master)](https://dev.azure.com/johnwatson484/John%20D%20Watson/_build/latest?definitionId=42&branchName=master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=johnwatson484_dream-league-web&metric=alert_status)](https://sonarcloud.io/dashboard?id=johnwatson484_dream-league-web)
[![Known Vulnerabilities](https://snyk.io/test/github/johnwatson484/dream-league-web/badge.svg)](https://snyk.io/test/github/johnwatson484/dream-league-web)
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

