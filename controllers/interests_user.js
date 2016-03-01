require('dotenv').load()
const collections = ['interests']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')
const _ = require('lodash')

module.exports = {
    index: {
        handler: function (request, reply) {
            'use strict'

            if (!request.payload.key || request.payload.key != process.env.API_KEY) {
                reply('You need an api key to access data')
            }

            let unselected_interests = request.payload.unselected_interests
            let selected_interests = request.payload.selected_interests
            let user_id = request.payload.user_id

            unselected_interests.forEach((interest) => {
                db.interests.update({
                    name: interest,
                }, {
                    $pull: {
                        users: user_id
                    }
                }, function (err, result) {
                    console.log('user removed')
                })
            })

            selected_interests.forEach((interest) => {
                db.interests.update({
                    name: interest,
                }, {
                    $addToSet: {
                        users: user_id
                    }
                }, function (err, result) {
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
                selected_interests: Joi.array().includes(Joi.string()).required().description('interests selected by user, should be an array'),
                unselected_interests: Joi.array().includes(Joi.string()).required().description('interests unselected by user, should be an array'),
                user_id: Joi.string().required().description('id of user'),
            }
        }

    }

}