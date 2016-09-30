require('dotenv').load();
const Yelp = require('yelp-v3');


const yelp = new Yelp({
  access_token: process.env.YELP_V3_TOKEN,
});

module.exports = {
  index: {
    handler: (request, reply) => {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      } else {
        let phone = request.query.phone;
        phone = phone.replace(/[^A-Z0-9]/ig, '');
        phone = `+1${phone}`;
        yelp.phoneSearch({ phone }, (error, data) => {
          if (data && data.total > 0) {
            const businesses = data.businesses;

            yelp.businessesReviews(businesses[0].id, (err, reviews) => {
              yelp.businesses(businesses[0].id, (e, business) => {
                /* eslint no-param-reassign: ["error", { "props": false }]*/
                business.reviews = reviews.reviews;
                reply(business);
              });
            });
          } else {
            reply(null);
          }
        });
      }
    },
  },
};
