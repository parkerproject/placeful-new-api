require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');

module.exports = {
  index: {
    handler(request, reply) {
      'use strict';

      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      // get user interests from parse and match with promotions tags

      const queryObject = {
        likes: decodeURIComponent(request.query.user_id),
      };
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      let count = 0;

      db.promotions.count(queryObject, function (err, res) {
        if (err) console.log(err);
        count = res;
        db.promotions.find(queryObject).sort({
          business_name: 1,
        }).skip(skip).limit(limit, function (err, results) {
          if (err) console.log(err);
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },

    description: 'View places for this user',
    notes: 'view places for this user',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        user_id: Joi.string().required().description('id of the user'),
      },
    },

  },

};
