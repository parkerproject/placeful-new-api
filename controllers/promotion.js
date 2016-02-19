require('dotenv').load()
const collections = ['promotions']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')
const _ = require('lodash')

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.query.key || request.query.key != process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      db.promotions.find({
        deal_id: request.query.promotion_id
      }).limit(1, function (err, result) {
        reply(result)
      })

    },

    description: 'View promotion',
    notes: 'view promotion',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        promotion_id: Joi.string().required().description('id of the promotion'),
      }
    }

  }

}