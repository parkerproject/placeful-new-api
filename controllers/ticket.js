require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');
const _ = require('lodash');
module.exports = {
  index: {
    handler(request, reply) {
      'use strict';
      if (!request.payload.key || request.payload.key != process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      db.tickets.find({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id,
      }).limit(1, (err, result) => {
        if (err) console.log(err);
        if (result.length == 0) {
          db.tickets.save(request.payload, () => {
            reply({
              message: 'ticket saved',
              status: 1,
            });
          });
        }
      });
    },
    description: 'Join list',
    notes: 'User gets ticket by joining list',
    tags: ['api'],
    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        ticket_id: Joi.string().required().description('id of a ticket'),
        user_id: Joi.string().description('id of a user'),
        title: Joi.string().description('title of ticket'),
        person_name: Joi.string().description('name of person'),
        start_date: Joi.string().description('ticket start date'),
        end_date: Joi.string().description('ticket end date'),
        address: Joi.string().description('address on ticket'),
        fine_print: Joi.string().description('fine print on ticket'),
        merchant_name: Joi.string().description('name of place'),
        start_time: Joi.string().description('start time of promotion'),
        end_time: Joi.string().description('end time of promotion'),
      },
    },
  },

  v2: {
    handler(request, reply) {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      const payload = request.payload;

      db.tickets.find({
        ticket_id: request.payload.ticket_id,
        user_id: request.payload.user_id,
      }).limit(1, (err, res) => {
        if (err) console.log(err);
        if (res.length === 0) {
          delete payload.key;
          delete payload._id;
          const plan = payload.plan;
          plan.user_id = payload.user_id;

          db.tickets.save(plan, () => {
            db.tickets.find({ user_id: request.payload.user_id }, (err2, result) => {
              reply({
                result,
                total_amount: result.length,
              });
            });
          });
        }
      });
    },
  },
};
