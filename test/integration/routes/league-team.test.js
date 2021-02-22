const api = require('../../../app/api')
jest.mock('../../../app/api')
jest.mock('../../../app/plugins/auth')
jest.mock('../../../app/plugins/crumb')
let createServer
let server
const teams = [{ teamId: 1 }, { teamId: 2 }]

describe('team route test', () => {
  beforeAll(async () => {
    createServer = require('../../../app/server')
  })

  beforeEach(async () => {
    api.get.mockResolvedValue({ teams })
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })

  test('GET /league/teams returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/league/teams'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /league/teams returns teams view', async () => {
    const options = {
      method: 'GET',
      url: '/league/teams'
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('league/teams')
  })

  test('GET /league/teams passes teams to view', async () => {
    const options = {
      method: 'GET',
      url: '/league/teams'
    }

    const result = await server.inject(options)
    expect(result.request.response.source.context.teams).toStrictEqual({ teams })
  })

  test('GET /league/teams/create returns view', async () => {
    const options = {
      method: 'GET',
      url: '/league/team/create'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('league/create-team')
  })

  test('POST /league/teams/create redirects as 302 if payload valid', async () => {
    const options = {
      method: 'POST',
      url: '/league/team/create',
      payload: {
        name: 'Newcastle United',
        alias: 'Newcastle',
        divisionId: 1
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(302)
  })

  test('POST /league/teams/create redirects to /league/teams if payload valid', async () => {
    const options = {
      method: 'POST',
      url: '/league/team/create',
      payload: {
        name: 'Newcastle United',
        alias: 'Newcastle',
        divisionId: 1
      }
    }

    const result = await server.inject(options)
    expect(result.headers.location).toBe('/league/teams')
  })

  test('POST /league/teams/create returns same page if payload invalid', async () => {
    const options = {
      method: 'POST',
      url: '/league/team/create',
      payload: {
        name: 'Newcastle United'
      }
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('league/create-team')
  })

  test('POST /league/teams/create returns same page if payload empty', async () => {
    const options = {
      method: 'POST',
      url: '/league/team/create'
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('league/create-team')
  })

  test('POST /league/teams/create returns 400 for invalid payload', async () => {
    const options = {
      method: 'POST',
      url: '/league/team/create'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
