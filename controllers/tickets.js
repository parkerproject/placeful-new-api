require('dotenv').load()
const db = '../../db.js'
const Joi = require('joi')
const _ = require('lodash')

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.query.key || request.query.key != process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      // get user interests from parse and match with promotions tags

      let queryObject = {
        user_id: request.query.user_id
      }
      let skip = request.query.offset || 0
      let limit = request.query.limit || 20
      let count = 0

      db.tickets.count(queryObject, function (err, res) {
        count = res
        db.tickets.find(queryObject).sort({
          _id: 1
        }).skip(skip).limit(limit, function (err, results) {
          reply({
            results: results,
            total_amount: count
          })
        })

      })

    },

    description: 'Get tickets for this user',
    notes: 'Get tickets for this user',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        user_id: Joi.string().required().description('id of the user')
      }
    }

  }

}