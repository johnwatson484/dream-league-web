import { isInRole } from '../../src/auth/is-in-role.js'

describe('role authorisation check', () => {
  test('a user with the required role is authorised', () => {
    const credentials = { scope: ['user', 'admin'] }

    expect(isInRole(credentials, 'admin')).toBe(true)
  })

  test('a user without the required role is not authorised', () => {
    const credentials = { scope: ['user'] }

    expect(isInRole(credentials, 'admin')).toBe(false)
  })

  test('null credentials are handled safely as unauthorised', () => {
    expect(isInRole(null, 'admin')).toBe(false)
  })

  test('undefined credentials are handled safely as unauthorised', () => {
    expect(isInRole(undefined, 'admin')).toBe(false)
  })

  test('credentials without a scope property are treated as unauthorised', () => {
    expect(isInRole({}, 'admin')).toBe(false)
  })
})
