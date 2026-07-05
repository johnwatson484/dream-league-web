import { compare } from '../../src/utils/compare.ts'

describe('compare', () => {
  test('returns -1 when the first value is less than the second', () => {
    expect(compare(1, 2)).toBe(-1)
  })

  test('returns 1 when the first value is greater than the second', () => {
    expect(compare(2, 1)).toBe(1)
  })

  test('returns 0 when both values are equal', () => {
    expect(compare(1, 1)).toBe(0)
  })

  test('compares strings alphabetically', () => {
    expect(compare('Alice', 'Bob')).toBe(-1)
    expect(compare('Bob', 'Alice')).toBe(1)
    expect(compare('Alice', 'Alice')).toBe(0)
  })
})
