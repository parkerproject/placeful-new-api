'use strict';
require('dotenv').load();
const mongojs = require('mongojs');
const Joi = require('joi');
const Moment = require('moment');

const collections = ['promotions'];
const db = mongojs.connect(process.env.MONGODB_URL, collections);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      // get user interests and match with promotions tags
      const skip = request.query.offset || 0;
      const limit = request.query.limit || 20;
      let count = 0;
      const day = days[new Date().getDay()];
      const queryObject = {
        merchant_id: {
          $nin: ['pcCxqeV5C5O6OtpEqMhw'], // filter out promos by demo
        },
        approved: true,
      };

      if (request.query.merchant_locality) {
        const area = new RegExp(decodeURIComponent(request.query.merchant_locality), 'i');
        queryObject.merchant_locality = area;
      }

      queryObject.start_date = {
        $lte: new Moment().format(),
      };
      queryObject.end_date = {
        $gte: new Moment().format(),
      };
      queryObject.days = new RegExp(day, 'i');

      const now = new Date();
      let thisHour = now.getHours();
      const thisMinute = now.getMinutes();
      thisHour = thisHour < 10 ? `0${thisHour}` : thisHour;
      const thisTime = `${thisHour}:${thisMinute}`; // time format in hh:mm

      queryObject.endTimeString = {
        $gte: thisTime,
      };

      if (request.query.geo) {
        const lng = Number(request.query.geo.split(',')[0]);
        const lat = Number(request.query.geo.split(',')[1]);
        queryObject.loc = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            // $maxDistance: 16093.4 // 10 miles
          },
        };
      }

      db.promotions.count(queryObject, (err, res) => {
        if (err) console.log(err);
        count = res;
        db.promotions.find(queryObject).skip(skip).limit(limit, (error, results) => {
          if (error) console.log(error);
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },
    description: 'View promotions',
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
