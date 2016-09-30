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

      db.interests.find({}, (err, results) => {
        if (err) console.log(err);
        reply(results);
      });
    },

    description: 'interests hashtags',
    notes: 'define your interests',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
      },
    },

  },

};
