require('dotenv').load()
const collections = ['merchants']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      db.merchants.update({
        business_id: request.payload.business_id
      }, {
        $addToSet: {
          followers: request.payload.user_id
        }
      }, function (err, result) {
        if (err) console.log(err)
        reply({
          message: 'follower added',
          status: 1
        })
      })
    },

    description: 'Follow a place',
    notes: 'follow a place',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        business_id: Joi.string().required().description('id of a place'),
        user_id: Joi.string().required().description('id of a user')
      }
    }

  }

}