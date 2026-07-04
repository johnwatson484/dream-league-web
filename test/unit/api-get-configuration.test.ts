import { getConfiguration } from '../../src/api/get-configuration.ts'

describe('API request configuration', () => {
  test('includes the provided token in the Authorization header', () => {
    const config = getConfiguration('Bearer my-token')

    expect(config.headers.Authorization).toBe('Bearer my-token')
  })

  test('defaults to an empty Authorization header when no token is provided', () => {
    const config = getConfiguration()

    expect(config.headers.Authorization).toBe('')
  })

  test('enables JSON response parsing', () => {
    const config = getConfiguration()

    expect(config.json).toBe(true)
  })
})
