const Joi = require('joi');
const Moment = require('moment');
const paginate = require('mongojs-paginate');
const db = require('../helpers/db');


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

      if (request.query.merchant_locality && request.query.merchant_locality !== 'undefined') {
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
          .description('id of user, match the right promotions to user'),
        merchant_locality: Joi.string()
          .description('where promotion is taking place'),
      },
    },
  },

  v2: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }
      // get user interests and match with promotions tags
      const page = request.query.page || 1;
      const limit = request.query.limit || 20;
      const day = days[new Date().getDay()];
      const queryObject = {
        merchant_id: {
          $nin: ['pcCxqeV5C5O6OtpEqMhw'], // filter out promos by demo
        },
        approved: true,
      };

      if (request.query.merchant_locality && request.query.merchant_locality !== 'undefined') {
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

      const query = db.promotions.find(queryObject);

      paginate(query, {
        limit,
        page,
      }, (err, results) => {
        // Result:
        // items: containing items of the desired page
        // itemCount: non paged count of items returned by query
        // page: current page
        // pageCount: Number of pages
        // limit: Number of items returned by page
        // next: index of the next page or undefined if no next page exists
        // hasNext: true if next page exists otherwise false
        // previous: index of the previous page or undefined if no previous page exists
        // hasPrevious: true if previous page exists otherwise false
        reply(results);
      });
    },
    description: 'View promotions v2',
    notes: 'view promotions v2',
    tags: ['api'],
    validate: {
      query: {
        key: Joi.string().required().description('API key to access data'),
        limit: Joi.number()
          .integer()
          .min(1)
          .default(20)
          .description('defaults to 20'),
        page: Joi.number()
          .integer()
          .description('defaults to 0'),
        geo: Joi.string()
          .description('geo location of promotion, geo=longitude,latitude'),
        user_id: Joi.string()
          .description('id of user, match the right promotions to user'),
        merchant_locality: Joi.string()
          .description('where promotion is taking place'),
      },
    },
  },
};