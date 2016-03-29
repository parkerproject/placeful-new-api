require('dotenv').load()
const collections = ['tickets']
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
      db.tickets.remove({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id
      }, (err, result) => {
        if (err) console.log(err)
        reply({
          message: 'Removed from list',
          status: 1
        })
      })
    },
    description: 'Remove from list',
    notes: 'User deletes ticket by leaving list',
    tags: ['api'],
    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        ticket_id: Joi.string().required().description('id of a ticket'),
        user_id: Joi.string().required().description('id of a user')
      }
    }
  }
}
