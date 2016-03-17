require('dotenv').load()
const collections = ['promotions']
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

      db.promotions.update({
        deal_id: request.payload.deal_id
      }, {
        $pull: {
          likes: request.payload.user_id
        }
      }, function (err, result) {
        reply({
          message: 'like removed',
          status: 1
        })
      })

    },

    description: 'unlike a promotion',
    notes: 'unlike a promotion',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user'),
        deal_id: Joi.string().required().description('id of promotion')
      }
    }

  }

}