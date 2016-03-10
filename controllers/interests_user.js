require('dotenv').load()
const collections = ['interests']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')
const interests = [
  'food',
  'drinks',
  'party',
  'trendy',
  'culture',
  'beauty',
  'fitness',
  'events',
  'fashion',
  'music',
  'afterwork',
  'wellness',
  'comedy',
  'datenight'
]

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      let selected_interests = request.payload.selected_interests
      let user_id = request.payload.user_id
      let unselected_interests = _.difference(interests, selected_interests)

      unselected_interests.forEach((interest) => {
        db.interests.update({
          name: interest
        }, {
          $pull: {
            users: user_id
          }
        }, function (err, result) {
          if (err) console.log(err)
          console.log('user removed')
        })
      })

      selected_interests.forEach((interest) => {
        db.interests.update({
          name: interest
        }, {
          $addToSet: {
            users: user_id
          }
        }, function (err, result) {
          if (err) console.log(err)
          console.log('user added')
        })
      })

      reply({
        message: 'user interests updated',
        status: 1
      })
    },

    description: 'User select interests',
    notes: 'user select interests',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        selected_interests: Joi.array().includes(Joi.string()).required().description('interests selected by user, should be an array, all in lowercase'),
        user_id: Joi.string().required().description('id of user')
      }
    }

  }
}