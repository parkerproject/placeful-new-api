require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      // get user interests from parse and match with promotions tags

      const queryObject = {
        merchant_id: request.query.merchant_id,
        approved: true,
      };
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      let count = 0;

      db.promotions.count(queryObject, (err, res) => {
        count = res;
        db.promotions.find(queryObject).sort({
          start_date: 1,
        }).skip(skip).limit(limit, (error, results) => {
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },

    description: 'View promotions for a place',
    notes: 'view promotions for a place',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number().integer().min(1).default(20).description('defaults to 20'),
        offset: Joi.number().integer().description('defaults to 0'),
        merchant_id: Joi.string().required().description('id of the place'),
      },
    },

  },

};
