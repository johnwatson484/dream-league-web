import { describe, beforeEach, test, expect } from 'vitest'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { parseTeamsheet } from '../../src/refresh/teamsheet/parse.ts'

const BASE_TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet.xlsx')
const TEST_FILE = resolve(import.meta.dirname, '../files/teamsheet-tmp.xlsx')

describe('parsing teamsheet', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE)
    }
    fs.copyFileSync(BASE_TEST_FILE, TEST_FILE)
  })

  test('should return teams when valid file', async () => {
    const result = await parseTeamsheet(TEST_FILE)

    expect(result).not.toBeNull()
    expect(result!.length).toBe(13)
  })

  test('should include all managers', async () => {
    const result = await parseTeamsheet(TEST_FILE) as { manager: string }[]

    expect(result.filter(x => x.manager === 'John').length).toBe(1)
    expect(result.filter(x => x.manager === 'Lee').length).toBe(1)
    expect(result.filter(x => x.manager === 'Scott').length).toBe(1)
    expect(result.filter(x => x.manager === 'David').length).toBe(1)
    expect(result.filter(x => x.manager === 'Billy').length).toBe(1)
    expect(result.filter(x => x.manager === 'Bob').length).toBe(1)
    expect(result.filter(x => x.manager === 'Conor').length).toBe(1)
    expect(result.filter(x => x.manager === 'Daz').length).toBe(1)
    expect(result.filter(x => x.manager === 'Rob').length).toBe(1)
    expect(result.filter(x => x.manager === 'Tucker').length).toBe(1)
    expect(result.filter(x => x.manager === 'Tommy/Pete').length).toBe(1)
    expect(result.filter(x => x.manager === 'Michael').length).toBe(1)
    expect(result.filter(x => x.manager === 'Ben').length).toBe(1)
  })

  test('should include 15 players per team', async () => {
    const result = await parseTeamsheet(TEST_FILE) as { players: unknown[] }[]

    for (const team of result) {
      expect(team.players.length).toBe(15)
    }
  })

  test('should delete temp file after parsing', async () => {
    await parseTeamsheet(TEST_FILE)

    expect(fs.existsSync(TEST_FILE)).toBe(false)
  })
})
