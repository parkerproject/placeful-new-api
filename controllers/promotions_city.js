const Joi = require('joi');
const Moment = require('moment');
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

      const area = new RegExp(decodeURIComponent(request.query.city), 'i');
      queryObject.merchant_locality = area;

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

      db.promotions.count(queryObject, (err, res) => {
        if (err) console.log(err);
        count = res;
        db.promotions.find(queryObject).skip(skip).limit(limit, (error, results) => {
          if (error) console.log(error);
          console.log(results);
          reply({
            results,
            total_amount: count,
          });
        });
      });
    },
    description: 'View promotions in a city',
    notes: 'view promotions in a city',
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
        user_id: Joi.string()
        .description('id of user, match the right promotions to user'),
        city: Joi.string()
        .required()
        .description('where promotion is taking place'),
      },
    },
  },
};
