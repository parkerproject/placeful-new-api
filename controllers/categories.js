require('dotenv').load()
const collections = ['promo_categories']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      let queryObject = {}

      db.promo_categories.find({}, function (err, results) {
        if (err) console.log(err)
        reply({
          results: results,
        })
      })
    },

    description: 'categories',
    notes: 'categories',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user')
      }
    }

  }

}
