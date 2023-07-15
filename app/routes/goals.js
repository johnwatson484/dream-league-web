const Joi = require('joi')
const { get, post } = require('../api')
const { GET, POST } = require('../constants/verbs')

module.exports = [{
  method: GET,
  path: '/goals',
  handler: async (request, h) => {
    const goals = await get('/goals', request.state.dl_token)
    return h.view('goals', { goals })
  }
}, {
  method: GET,
  path: '/goal',
  handler: async (request, h) => {
    const goal = await get(`/goal/detail/?goalId=${request.query.goalId}`, request.state.dl_token)
    return h.view('goal', goal)
  }
}, {
  method: GET,
  path: '/goal/delete',
  options: { auth: { strategy: 'jwt', scope: ['admin'] } },
  handler: async (request, h) => {
    const goal = await get(`/goal/?goalId=${request.query.goalId}`, request.state.dl_token)
    return h.view('delete-goal', { goal })
  }
}, {
  method: POST,
  path: '/goal/delete',
  options: {
    auth: { strategy: 'jwt', scope: ['admin'] },
    validate: {
      payload: Joi.object({
        goalId: Joi.number().required()
      }),
      failAction: async (request, h, error) => {
        const goal = await get(`/goal/?goalId=${request.query.goalId}`, request.state.dl_token)
        return h.view('delete-goal', { goal, error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await post('/goal/delete', request.payload, request.state.dl_token)
      return h.redirect('/goals')
    }
  }
}]
