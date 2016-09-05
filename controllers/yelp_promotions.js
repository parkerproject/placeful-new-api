require('dotenv').load();
const Yelp = require('yelp-v3');

const yelp = new Yelp({
  access_token: process.env.YELP_V3_TOKEN,
});


module.exports = {
  index: {
    handler: (request, reply) => {
      const term = encodeURIComponent(request.query.term);
      const longitude = request.query.longitude;
      const latitude = request.query.latitude;
      yelp.search({ term, latitude, longitude }, (error, data) => {
        if (error) console.log(error);
        reply(data);
      });
    },
  },
};
