require('dotenv').load();
const db = require('../helpers/db');
const Joi = require('joi');
const _ = require('lodash');
const interests = [
  'food',
  'drinks',
  'party',
  'trendy',
  'culture',
  'beauty',
  'fitness',
  'events',
  'fashion',
  'music',
  'afterwork',
  'wellness',
  'comedy',
  'datenight',
];

module.exports = {
  index: {
    handler(request, reply) {
      'use strict';

      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      const selected_interests = request.payload.selected_interests;
      const user_id = request.payload.user_id;
      const unselected_interests = _.difference(interests, selected_interests);

      unselected_interests.forEach((interest) => {
        db.interests.update({
          name: interest,
        }, {
          $pull: {
            users: user_id,
          },
        }, function (err, result) {
          if (err) console.log(err);
          console.log('user removed');
        });
      });

      selected_interests.forEach((interest) => {
        db.interests.update({
          name: interest,
        }, {
          $addToSet: {
            users: user_id,
          },
        }, function (err, result) {
          if (err) console.log(err);
          console.log('user added');
        });
      });

      reply({
        message: 'user interests updated',
        status: 1,
      });
    },

    description: 'User select interests',
    notes: 'user select interests',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        selected_interests: Joi.array().includes(Joi.string()).required().description('interests selected by user, should be an array, all in lowercase'),
        user_id: Joi.string().required().description('id of user'),
      },
    },

  },
};
