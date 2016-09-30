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

      db.merchants.findAndModify({
        query: { business_id: request.payload.business_id },
        update: { $addToSet: { followers: request.payload.user_id } },
        new: true,
      }, function (err, doc, lastErrorObject) {
        if (err) console.log(err);

        if (!doc) {
          db.promotions.find({ merchant_id: request.payload.business_id },
            { merchant_name: 1, _id: 0 }).limit(1, function (err, result) {
              db.merchants.findAndModify({
                query: { business_name: result[0].merchant_name },
                update: { $addToSet: { followers: request.payload.user_id } },
                new: true,
              }, function (error, doc, lastErrorObject) {
                if (error) console.log(error);
                db.promotions.update({
                  merchant_id: request.payload.business_id,
                }, { $set: { followers: doc.followers } }, { multi: true },
                function (error, result) {
                  if (error) console.log(error);
                  reply({
                    message: 'follower added',
                    status: 1,
                  });
                });
              });
            });
        } else {
          db.promotions.update({
            merchant_id: request.payload.business_id,
          }, { $set: { followers: doc.followers } }, { multi: true },
            function (error, result) {
              if (error) console.log(error);
              reply({
                message: 'follower added',
                status: 1,
              });
            });
        }
      });
    },

    description: 'Follow a place',
    notes: 'follow a place',
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
