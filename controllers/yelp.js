const unirest = require('unirest');

const req = unirest('GET', 'https://api.yelp.com/v3/businesses/search/phone');

req.headers({
  'cache-control': 'no-cache',
  authorization: `Bearer ${process.env.YELP_TOKEN}`,
});

module.exports = {
  index: {
    handler(request, reply) {
      req.query({
        phone: request.query.phone,
      });

      req.end((res) => {
        if (res.error) console.log(res.error);

        reply(res.body);
      });
    },
  },
};
