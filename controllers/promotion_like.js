require('dotenv').load()
const db = '../../db.js'
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
        $addToSet: {
          likes: request.payload.user_id
        }
      }, function (err, result) {
        reply({
          message: 'like added',
          status: 1
        })
      })

    },

    description: 'Like a promotion',
    notes: 'like a promotion',
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