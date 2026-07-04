import { mapAuth } from '../../src/auth/map-auth.ts'

describe('authentication state mapping', () => {
  test('an authenticated admin user has all flags set correctly', () => {
    const request = {
      auth: {
        isAuthenticated: true,
        credentials: { scope: ['user', 'admin'] },
      },
    }

    const result = mapAuth(request)

    expect(result).toEqual({
      isAuthenticated: true,
      isAnonymous: false,
      isUser: true,
      isAdmin: true,
    })
  })

  test('an authenticated non-admin user is not flagged as admin', () => {
    const request = {
      auth: {
        isAuthenticated: true,
        credentials: { scope: ['user'] },
      },
    }

    const result = mapAuth(request)

    expect(result.isAdmin).toBe(false)
    expect(result.isUser).toBe(true)
  })

  test('an unauthenticated visitor is anonymous', () => {
    const request = {
      auth: {
        isAuthenticated: false,
        credentials: null,
      },
    }

    const result = mapAuth(request)

    expect(result).toEqual({
      isAuthenticated: false,
      isAnonymous: true,
      isUser: false,
      isAdmin: false,
    })
  })
})
