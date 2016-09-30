require('dotenv').load();
const qs = require('querystring');
const get = require('request');
const promoTemplate = require('./item');

const baseUrl = 'https://api.foursquare.com/v2/venues/search?';

module.exports = {
  index: {
    handler(request, reply) {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      }

      const options = {};
      options.offset = request.query.offset || 0;
      options.limit = request.query.limit || 10;
      options.lng = Number(request.query.lon);
      options.lat = Number(request.query.lat);
      options.venue = decodeURIComponent(request.query.venue);

      const url = baseUrl + qs.stringify({
        client_id: process.env.FOURSQUARE_CLIENTIDKEY,
        client_secret: process.env.FOURSQUARE_CLIENTSECRETKEY,
        v: '20140806',
        ll: `${options.lat},${options.lng}`,
        venuePhotos: 1,
        openNow: 1,
        limit: options.limit,
       // offset: options.offset,
        query: options.venue,
      });

      get(url, (error, response, body) => {
        if (error) console.log(error);
        if (!error && response.statusCode === 200) {
          // const count = JSON.parse(body).response.totalResults;
          // const neighborhood = JSON.parse(body).response.headerLocation;
          //console.log(JSON.parse(body).response);
          //const items = JSON.parse(body).response.groups[0].items;
          //const modifiedArr = items.map(item => promoTemplate(item, neighborhood));
         // reply({ results: items, total_amount: count });
         reply(JSON.parse(body).response.venues[0]);
        }
      });
    },
  },
};
