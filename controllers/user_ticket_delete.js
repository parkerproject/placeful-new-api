require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');

module.exports = {
  index: {
    handler(request, reply) {
      'use strict';
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      db.tickets.remove({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id,
      }, (err, result) => {
        if (err) console.log(err);
        reply({
          message: 'Removed from list',
          status: 1,
        });
      });
    },
    description: 'Remove from list',
    notes: 'User deletes ticket by leaving list',
    tags: ['api'],
    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        ticket_id: Joi.string().required().description('id of a ticket'),
        user_id: Joi.string().required().description('id of a user'),
      },
    },
  },

  v2: {
    handler(request, reply) {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      db.tickets.remove({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id,
      }, () => {
        const queryObject = {
          user_id: request.query.user_id,
        };
        const skip = request.query.offset || 0;
        const limit = request.query.limit || 20;

        db.tickets.find(queryObject).sort({
          _id: 1,
        }).skip(skip).limit(limit, (error, results) => {
          reply({
            results,
          });
        });
      });
    },
  },
};
