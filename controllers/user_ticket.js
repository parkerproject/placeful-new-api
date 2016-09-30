require('dotenv').load();
const Joi = require('joi');
const _ = require('lodash');
const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key != process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      const queryObject = {
        user_id: request.query.user_id,
        ticket_id: request.query.ticket_id,
      };

      db.tickets.find(queryObject).limit(1, (err, result) => {
        const total_amount = (result.length === 1) ? 1 : 0;
        reply({
          result,
          total_amount,
        });
      });
    },

    description: 'check if user has this ticket',
    notes: 'check if user has this ticket',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of the user'),
        ticket_id: Joi.string().required().description('id of ticket'),
      },
    },

  },

};
