import type { Request } from '@hapi/hapi'
import { getConfiguration } from '../../src/api/get-configuration.ts'

describe('API request configuration', () => {
  test('includes the access token from the request session in the Authorization header', () => {
    const request = { app: { session: { accessToken: 'my-token' } } } as unknown as Request

    const config = getConfiguration(request)

    expect(config.headers.Authorization).toBe('Bearer my-token')
  })

  test('omits Authorization header when no session is present', () => {
    const config = getConfiguration()

    expect(config.headers.Authorization).toBeUndefined()
  })

  test('omits Authorization header when session has no access token', () => {
    const request = { app: { session: null } } as unknown as Request

    const config = getConfiguration(request)

    expect(config.headers.Authorization).toBeUndefined()
  })

  test('enables JSON response parsing', () => {
    const config = getConfiguration()

    expect(config.json).toBe(true)
  })
})
