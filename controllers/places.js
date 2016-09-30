require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');
const _ = require('lodash');
module.exports = {
  index: {
    handler(request, reply) {
      'use strict';
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      // get user interests from parse and match with promotions tags
      const queryObject = {
        business_id: {
          $nin: ['dv8ySTnrbuB5nEEufY9p', 'pcCxqeV5C5O6OtpEqMhw'], // filter demo and admin places
        },
        approved: true,
      };
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      let count = 0;
      if (request.query.geo) {
        const lng = Number(request.query.geo.split(',')[0]);
        const lat = Number(request.query.geo.split(',')[1]);
        queryObject.loc = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          // $maxDistance: 16093.4 // 10 miles
          },
        };
      }
      db.merchants.count(queryObject, function (err, res) {
        if (err) console.log(err);
        count = res;
        db.merchants.find(queryObject).skip(skip).limit(limit, function (err, results) {
          if (err) console.log(err);
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },
    description: 'View places',
    notes: 'view places',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        geo: Joi.string().description('geo location of place, format should be geo=longitude,latitude'),
      },
    },
  },
};
