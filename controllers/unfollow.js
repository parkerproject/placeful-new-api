require('dotenv').load()
const collections = ['merchants']
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

      db.merchants.update({
        business_id: request.query.business_id
      }, {
        $pull: {
          followers: request.query.user_id
        }
      }, function (err, result) {
        reply(result)
      })

    },

    description: 'UnFollow a place',
    notes: 'unfollow a place',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        business_id: Joi.string().required().description('id of a place'),
        user_id: Joi.string().required().description('id of a user'),
      }
    }

  }

}