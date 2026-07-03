import { sortArray } from '../../src/utils/sort-array.js'

describe('sort array comparator', () => {
  test('returns -1 when the first value is less than the second', () => {
    expect(sortArray(1, 2)).toBe(-1)
  })

  test('returns 1 when the first value is greater than the second', () => {
    expect(sortArray(2, 1)).toBe(1)
  })

  test('returns 0 when both values are equal', () => {
    expect(sortArray(1, 1)).toBe(0)
  })

  test('compares strings alphabetically', () => {
    expect(sortArray('Alice', 'Bob')).toBe(-1)
    expect(sortArray('Bob', 'Alice')).toBe(1)
    expect(sortArray('Alice', 'Alice')).toBe(0)
  })
})
