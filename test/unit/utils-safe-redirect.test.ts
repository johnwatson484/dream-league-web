import { safePath } from '../../src/utils/safe-redirect.ts'

describe('safePath', () => {
  const fallback = '/fixtures'

  test('returns valid relative paths unchanged', () => {
    expect(safePath('/fixtures', fallback)).toBe('/fixtures')
    expect(safePath('/fixtures?gameweek=1', fallback)).toBe('/fixtures?gameweek=1')
    expect(safePath('/cup/detail?cupId=3', fallback)).toBe('/cup/detail?cupId=3')
  })

  test('returns fallback for absolute URLs', () => {
    expect(safePath('https://evil.com', fallback)).toBe(fallback)
    expect(safePath('http://evil.com', fallback)).toBe(fallback)
    expect(safePath('HTTP://EVIL.COM', fallback)).toBe(fallback)
  })

  test('returns fallback for protocol-relative URLs', () => {
    expect(safePath('//evil.com', fallback)).toBe(fallback)
  })

  test('returns fallback for javascript: scheme', () => {
    expect(safePath('javascript:alert(1)', fallback)).toBe(fallback)
  })

  test('returns fallback for empty or undefined input', () => {
    expect(safePath('', fallback)).toBe(fallback)
    expect(safePath(undefined, fallback)).toBe(fallback)
  })

  test('returns fallback for paths not starting with /', () => {
    expect(safePath('evil.com/path', fallback)).toBe(fallback)
    expect(safePath('relative/path', fallback)).toBe(fallback)
  })
})
