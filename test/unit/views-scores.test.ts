import nunjucks from 'nunjucks'

const views = nunjucks.configure('src/views', { autoescape: true })

test('renders scores in the order supplied by the API', () => {
  const scores = [
    { managerId: 3, manager: 'Charlie', goals: 4, conceded: 0, result: 'W', scorers: [] },
    { managerId: 2, manager: 'Bob', goals: 2, conceded: 1, result: 'W', scorers: [] },
    { managerId: 1, manager: 'alice', goals: 0, conceded: 3, result: 'L', scorers: [] },
  ]

  const html = views.render('_scores.njk', { results: { scores } })
  const managerIds = [...html.matchAll(/managerId=(\d+)/g)].map(match => Number(match[1]))

  expect(managerIds).toEqual([3, 2, 1])
  expect(scores.map(score => score.managerId)).toEqual([3, 2, 1])
  expect(html).toContain('4 - 0')
  expect(html).toContain('0 - 3')
})
