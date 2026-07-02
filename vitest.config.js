import { defineConfig, configDefaults } from 'vitest/config'

const sharedEnv = {
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret-at-least-32-characters!!',
  API_HOST: 'http://localhost:3001',
}

const coverageConfig = {
  provider: 'v8',
  reportsDirectory: './coverage',
  clean: false,
  reporter: ['text', 'lcov'],
  include: ['app/**/*.js'],
  exclude: [
    ...configDefaults.exclude,
    '**/test/**',
    'coverage',
  ],
}

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    coverage: coverageConfig,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.js'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.test.js'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
        },
      },
    ],
  },
})
