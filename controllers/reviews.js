const yelp = require('./yelp');
const Joi = require('joi');

module.exports = {
  index: {
    handler: (request, reply) => {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      if (request.query.phone) {
        yelp(decodeURIComponent(request.query.phone), (reviews) => {
          reply({
            yelp: reviews,
          });
        });
      } else {
        reply([]);
      }
    },
    description: 'get reviews for a place',
    notes: 'get reviews for a place',
    tags: ['api'],

    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        phone: Joi.string().description('phone of place'),
        merchant_name: Joi.string().required().description('name of place'),
      },
    },
  },
};
