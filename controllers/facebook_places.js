const unirest = require('unirest');
const { isArray, filter, lowerCase } = require('lodash');

const req = unirest('GET', 'https://graph.facebook.com/v2.9/search');


module.exports = {
  index: {
    handler(request, reply) {
      const { q, center } = request.query;
      req.query({
        access_token: process.env.FB_TOKEN,
        q: decodeURIComponent(q),
        type: 'place',
        center,
        distance: 12186.8,
        categories: "['FOOD_BEVERAGE']",
      });

      req.headers({
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
      });


      req.end((res) => {
        if (res.error) console.log(res.error);
        const data = JSON.parse(res.body).data;
        if (isArray(data)) {
          const place = filter(data, (obj) => {
            const nameOfPlace = lowerCase(obj.name);
            const queryTxt = lowerCase(decodeURIComponent(q));
            const result = nameOfPlace.includes(queryTxt) || queryTxt.includes(nameOfPlace);

            return result;
            // if (result) {
            //   return true;
            // }
            // return false;
          });

          if (place.length === 0) {
            reply({});
          } else {
            const placeId = place[0].id;
            const reqNext = unirest('GET', `https://graph.facebook.com/v2.9/${placeId}`);
            reqNext.query({
              access_token: process.env.FB_TOKEN,
              fields: 'about,website,engagement,restaurant_specialties,overall_star_rating,rating_count',
            });
            reqNext.end((result) => {
              if (result.error) console.log(res.error);

              reply(result.body);
            });
          }
        } else {
          reply({});
        }
      });
    },
  },
};
