require('dotenv').load();
const qs = require('querystring');
const request = require('request');
const promoTemplate = require('./item');

const baseUrl = 'https://api.foursquare.com/v2/venues/explore?';

module.exports = (options, cb) => {
  if (!options.lat && !options.lng) {
    throw new Error('Geo location is required');
  }
  const url = baseUrl + qs.stringify({
    client_id: process.env.FOURSQUARE_CLIENTIDKEY,
    client_secret: process.env.FOURSQUARE_CLIENTSECRETKEY,
    v: '20140806',
    ll: `${options.lat},${options.lng}`,
    venuePhotos: 1,
    openNow: 1,
    limit: options.limit,
    offset: options.offset,
  });

  request(url, (error, response, body) => {
    if (error) console.log(error);
    if (!error && response.statusCode === 200) {
      const count = JSON.parse(body).response.totalResults;
      const neighborhood = JSON.parse(body).response.headerLocation;
      const items = JSON.parse(body).response.groups[0].items;
      const modifiedArr = items.map(item => promoTemplate(item, neighborhood));
      cb(modifiedArr, count);
    }
  });
};
