import { mapPosition } from '../../src/refresh/teamsheet/map-position.js'

describe('teamsheet player index to position mapping', () => {
  test('index 0 is a goalkeeper', () => {
    expect(mapPosition(0)).toBe('GK')
  })

  test('index 1 is a goalkeeper', () => {
    expect(mapPosition(1)).toBe('GK')
  })

  test('indices 2 to 4 are defenders', () => {
    expect(mapPosition(2)).toBe('DEF')
    expect(mapPosition(3)).toBe('DEF')
    expect(mapPosition(4)).toBe('DEF')
  })

  test('indices 5 to 8 are midfielders', () => {
    expect(mapPosition(5)).toBe('MID')
    expect(mapPosition(6)).toBe('MID')
    expect(mapPosition(7)).toBe('MID')
    expect(mapPosition(8)).toBe('MID')
  })

  test('indices 9 and above are forwards', () => {
    expect(mapPosition(9)).toBe('FWD')
    expect(mapPosition(14)).toBe('FWD')
  })
})
