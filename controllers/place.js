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

      db.merchants.find({
        business_id: request.query.business_id,
      }).limit(1, function (err, result) {
        if (err) console.log(err);
        db.promotions.find({}).limit(1, (err, promos) => {
          if (err) console.log(err);

          if (result.length !== 0 && promos.length !== 0) {
            result[0].large_image = promos[0].large_image;
          }
          reply(result);
        });
      });
    },

    description: 'View a place',
    notes: 'view a place',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        business_id: Joi.string().required().description('id of a place'),
      },
    },

  },

};
