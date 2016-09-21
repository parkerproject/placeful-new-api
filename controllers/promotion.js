require('dotenv').load();

const db = '../../db.js';
const Joi = require('joi');


module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      const queryObj = {};

      if (request.query.ticket_id) {
        queryObj.ticket_id = request.query.ticket_id;
      }


      if (request.query.ticket_id) {
        queryObj.deal_id = request.query.promotion_id;
      }

      db.promotions.find(queryObj).limit(1, (err, result) => {
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
        ticket_id: Joi.number.description('ticket id of promotion'),
      },
    },

  },

};
