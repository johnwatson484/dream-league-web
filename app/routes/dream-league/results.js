const api = require('../../api')
const joi = require('joi')
const boom = require('@hapi/boom')
const ViewModel = require('../../view-models/teamsheet')

module.exports = [{
  method: 'GET',
  path: '/results/edit',
  handler: async (request, h) => {
    return h.view('dream-league/results-edit')
  }
}]
