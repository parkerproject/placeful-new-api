require('dotenv').load()
const collections = ['notifications']
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
      let skip = request.query.offset || 0
      let limit = request.query.limit || 20
      if (request.query.notification_id) {
        db.notifications.find({
          item_id: request.query.notification_id
        }, (err, result) => {
          if (err) console.log(err)
          let createdDateOfNotification = (result[0] != null) ? result[0].date_created : ''
          db.notifications.find({
            date_created: {
              $gt: createdDateOfNotification
            }
          }, (err, data) => {
            if (err) console.log(err)
            reply({
              results: data,
              total_amount: data.length
            })
          })
        })
      } else {
        db.notifications.find({}).sort({
          _id: -1
        }).skip(skip).limit(limit, (err, results) => {
          if (err) console.log(err)
          reply({
            results: results,
            total_amount: results.length
          })
        })
      }
    },
    description: 'get notifications',
    notes: 'get notifications',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        notification_id: Joi.string().description('item_id of the notification')
      }
    }
  }
}
