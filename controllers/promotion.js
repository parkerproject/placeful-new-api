require('dotenv').load();

const db = require('../helpers/db');
const Joi = require('joi');


module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      db.promotions.find({
        deal_id: request.query.promotion_id,
      }).limit(1, (err, result) => {
        reply(result);
      });
    },

    description: 'View promotion',
    notes: 'view promotion',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        promotion_id: Joi.string().required().description('id of the promotion'),
      },
    },

  },

};
