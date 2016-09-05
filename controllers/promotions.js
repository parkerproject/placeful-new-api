const Joi = require('joi');
const foursquarePromotions = require('./foursquare_promotions');

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      const options = {};
      options.offset = request.query.offset || 0;
      options.limit = request.query.limit || 20;
      options.lng = Number(request.query.geo.split(',')[0]);
      options.lat = Number(request.query.geo.split(',')[1]);

      foursquarePromotions(options, (results, count) => {
        reply({ results, total_amount: count });
      });
    },
    description: 'View promotions (version 2)',
    notes: 'view promotions',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number()
        .integer()
        .min(1)
        .default(20)
        .description('defaults to 20'),
        offset: Joi.number()
        .integer()
        .description('defaults to 0'),
        geo: Joi.string()
        .description('geo location of promotion, geo=longitude,latitude'),
        user_id: Joi.string()
        .required()
        .description('id of user, match the right promotions to user'),
        merchant_locality: Joi.string()
        .description('where promotion is taking place'),
      },
    },
  },
};
