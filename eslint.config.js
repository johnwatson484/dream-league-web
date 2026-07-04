import neostandard from 'neostandard'

export default [
  { ignores: ['.public/**'] },
  ...neostandard({
    ts: true,
    globals: ['describe', 'beforeEach', 'expect', 'test', 'afterEach', 'vi', 'beforeAll', 'afterAll', '$', 'XMLHttpRequest', 'dataLayer'],
  }),
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
]
