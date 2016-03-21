'use strict'

const yelp = require('./yelp')
const foursquare = require('./foursquare')
const Joi = require('joi')

module.exports = {
  index: {
    handler: (request, reply) => {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      foursquare(request.query.merchant_name, (fReviews) => {
        yelp(request.query.phone, (yReviews) => {
          reply({
            yelp: yReviews,
            foursquare: fReviews
          })
        })
      })
    },

    description: 'get reviews for a place',
    notes: 'get reviews for a place',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        phone: Joi.string().required().description('phone of place'),
        merchant_name: Joi.string().required().description('name of place')
      }
    }
  }
}