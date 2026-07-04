import { mapSubstitute } from '../../src/refresh/teamsheet/map-substitute.ts'

describe('teamsheet substitute identification', () => {
  test('index 1 is a substitute goalkeeper', () => {
    expect(mapSubstitute(1)).toBe(true)
  })

  test('index 4 is a substitute defender', () => {
    expect(mapSubstitute(4)).toBe(true)
  })

  test('index 8 is a substitute midfielder', () => {
    expect(mapSubstitute(8)).toBe(true)
  })

  test('index 14 is a substitute forward', () => {
    expect(mapSubstitute(14)).toBe(true)
  })

  test('index 0 is a starting goalkeeper not a substitute', () => {
    expect(mapSubstitute(0)).toBe(false)
  })

  test('non-substitute indices return false', () => {
    expect(mapSubstitute(2)).toBe(false)
    expect(mapSubstitute(5)).toBe(false)
    expect(mapSubstitute(9)).toBe(false)
  })
})
