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

      db.merchants.findAndModify({
        query: { business_id: request.payload.business_id },
        update: { $pull: { followers: request.payload.user_id } },
        new: true,
      }, function (err, doc, lastErrorObject) {
        if (err) console.log(err);
        db.promotions.update({
          merchant_id: request.payload.business_id,
        }, { $set: { followers: doc.followers } }, { multi: true },
          function (error, result) {
            if (error) console.log(error);
            reply({
              message: 'follower removed',
              status: 1,
            });
          });
      });
    },

    description: 'UnFollow a place',
    notes: 'unfollow a place',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        business_id: Joi.string().required().description('id of a place'),
        user_id: Joi.string().required().description('id of a user'),
      },
    },

  },

};
