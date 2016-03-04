require('dotenv').load()
const collections = ['notifications']
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

            db.notifications.find({}, (err, results) => {
                reply(results)
            })

        },

        description: 'get notifications',
        notes: 'get notifications',
        tags: ['api'],

        validate: {
            query: {
                key: Joi.string().required().description('API key to access data'),
                user_id: Joi.string().required().description('id of user')
            }
        }

    }

}