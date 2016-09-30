require('dotenv').load();

const db = require('../helpers/db');
const Joi = require('joi');
const axios = require('axios');

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      db.promotions.update({
        deal_id: request.payload.deal_id,
      }, {
        $addToSet: {
          likes: request.payload.user_id,
        },
      }, () => {
        reply({
          message: 'like added',
          status: 1,
        });
      });
    },

    description: 'Like a promotion',
    notes: 'like a promotion',
    tags: ['api'],

    validate: {
      payload: {
        key: Joi.string().required().description('API key to access data'),
        user_id: Joi.string().required().description('id of user'),
        deal_id: Joi.string().required().description('id of promotion'),
      },
    },
  },

  v2: {
    handler(request, reply) {
      if (!request.payload.key || request.payload.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      db.promotions.findAndModify({
        query: { deal_id: request.payload.deal_id },
        update: { $addToSet: { likes: request.payload.user_id } },
        new: true,
      }, (err, doc, lastErrorObject) => {
        if (err) console.log(err);
        const newArr = [];
        newArr.push(doc);

        axios.get(`http://0.0.0.0:1400/promotions?key=${request.payload.key}&geo=${request.payload.geo}&user_id=${request.payload.user_id}`)
        .then((response) => {
          reply({
            promo: newArr,
            promos: response.data,
          });
        });
      });
    },

  },

};
