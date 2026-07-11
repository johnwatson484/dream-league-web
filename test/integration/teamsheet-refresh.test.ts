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
    expect(result!).toHaveLength(13)
  })

  test('should include all managers', async () => {
    const result = await parseTeamsheet(TEST_FILE) as { manager: string }[]

    expect(result.filter(x => x.manager === 'John')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Lee')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Scott')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'David')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Billy')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Bob')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Conor')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Daz')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Rob')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Tucker')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Tommy/Pete')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Michael')).toHaveLength(1)
    expect(result.filter(x => x.manager === 'Ben')).toHaveLength(1)
  })

  test('should include 15 players per team', async () => {
    const result = await parseTeamsheet(TEST_FILE) as { players: unknown[] }[]

    for (const team of result) {
      expect(team.players).toHaveLength(15)
    }
  })

  test('should delete temp file after parsing', async () => {
    await parseTeamsheet(TEST_FILE)

    expect(fs.existsSync(TEST_FILE)).toBe(false)
  })
})
