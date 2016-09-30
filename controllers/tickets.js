require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      const queryObject = {
        user_id: request.query.user_id,
      };
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      let count = 0;

      db.tickets.count(queryObject, (err, res) => {
        count = res;
        db.tickets.find(queryObject).sort({
          _id: 1,
        }).skip(skip).limit(limit, (error, results) => {
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },

    description: 'Get tickets for this user',
    notes: 'Get tickets for this user',
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
