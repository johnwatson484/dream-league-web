import { buildUrl } from '../../src/api/build-url.ts'

describe('buildUrl', () => {
  test('appends params as query string', () => {
    expect(buildUrl('/league/teams', { search: 'Arsenal', division: '1' }))
      .toBe('/league/teams?search=Arsenal&division=1')
  })

  test('encodes special characters', () => {
    expect(buildUrl('/league/players', { search: 'O\'Brien & Sons' }))
      .toBe('/league/players?search=O%27Brien+%26+Sons')
  })

  test('omits undefined and empty values', () => {
    expect(buildUrl('/league/teams', { search: '', division: undefined }))
      .toBe('/league/teams')
  })

  test('returns path only when no params have values', () => {
    expect(buildUrl('/league/teams', {})).toBe('/league/teams')
  })

  test('encodes hash and plus characters', () => {
    expect(buildUrl('/league/players', { search: 'team#1+2' }))
      .toBe('/league/players?search=team%231%2B2')
  })
})
