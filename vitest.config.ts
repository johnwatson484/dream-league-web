import { defineConfig, configDefaults } from 'vitest/config'

const sharedEnv = {
  NODE_ENV: 'test',
  API_HOST: 'http://localhost:3001',
  COOKIE_PASSWORD: 'test-cookie-password-at-least-32-characters!!',
}

const coverageConfig = {
  provider: 'v8',
  reportsDirectory: './coverage',
  clean: false,
  reporter: ['text', 'lcov'],
  include: ['src/**/*.ts'],
  exclude: [
    ...configDefaults.exclude,
    '**/test/**',
    'coverage',
    'src/client/**',
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
          include: ['test/unit/**/*.test.ts'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.test.ts'],
          globals: true,
          clearMocks: true,
          environment: 'node',
          env: sharedEnv,
        },
      },
    ],
  },
})
