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

      // get user interests from parse and match with promotions tags

      let queryObject = {}
      let skip = request.query.offset || 0
      let limit = request.query.limit || 20
      let count = 0

      if (request.query.geo) {
        let lng = Number(request.query.geo.split(',')[0])
        let lat = Number(request.query.geo.split(',')[1])

        queryObject.loc = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            // $maxDistance: 16093.4 // 10 miles
          }
        }
      }

      db.merchants.count(queryObject, function (err, res) {
        count = res
        db.merchants.find(queryObject).sort({
          business_name: 1
        }).skip(skip).limit(limit, function (err, results) {
          reply({
            results: results,
            total_amount: count
          })
        })

      })

    },

    description: 'View places',
    notes: 'view places',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        geo: Joi.string().description('geo location of place, format should be geo=longitude,latitude')
      }
    }

  }

}