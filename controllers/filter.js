require('dotenv').load()
const collections = ['promotions']
const mongojs = require('mongojs')
const db = mongojs.connect(process.env.MONGODB_URL, collections)
const Joi = require('joi')

// var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
//
// let day = days[new Date().getDay()]

module.exports = {
  index: {
    handler: function (request, reply) {
      'use strict'

      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }

      // get user interests and match with promotions tags

      let queryObject = {}
      let skip = request.query.offset || 0
      let limit = request.query.limit || 20
      let count = 0
      let categories = [ 'Food & Drinks', 'Health & Beauty', 'Events & Activities', 'Shopping']

      if (request.query.cat_id) {
        queryObject.merchant_category = categories[request.query.cat_id]
      }

      if (request.query.geo) {
        let lng = Number(request.query.geo.split(',')[0])
        let lat = Number(request.query.geo.split(',')[1])

        queryObject.loc = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          // $maxDistance: 16093.4 // 10 miles
          }
        }
      }

      db.promotions.count(queryObject, function (err, res) {
        if (err) console.log(err)
        count = res
        db.promotions.find(queryObject).skip(skip).limit(limit, function (err, results) {
          if (err) console.log(err)
          reply({
            results: results,
            total_amount: count
          })
        })

      })
    },

    description: 'Filter promotions',
    notes: 'filter promotions',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        geo: Joi.string().description('geo location of promotion, format should be geo=longitude,latitude'),
        user_id: Joi.string().required().description('id of user, we use this to match the right promotions to user'),
        cat_id: Joi.string().required().description('category_id of promotion, you can find this value in {/categories} endpoint')
      }
    }

  }

}
