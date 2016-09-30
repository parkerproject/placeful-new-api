require('dotenv').load();
const Yelp = require('yelp-v3');
const slug = require('slug');
const randtoken = require('rand-token');


const yelp = new Yelp({
  access_token: process.env.YELP_V3_TOKEN,
});

function Item(response) {
  this.neighborhood = response.location.city;
  this.title = null;
  this.deal_id = null;
  this.tipsText = null;
  this.merchant_id = response.id;
  this.phone = response.phone;
  this.twitter = null;
  this.merchant_address = `${response.location.address1}, ${response.location.city} ${response.location.zip_code}`;
  this.merchant_name = response.name;
  this.merchant_locality = response.location.city;
  this.description = null;
  this.fine_print = null;
  this.start_date = null;
  this.end_date = null;
  this.slug = slug(response.name);
  this.ticket_id = randtoken.generate(16);
  this.likes = [];
  this.start_time = null;
  this.end_time = null;
  this.endTimeString = null;
  this.approved = true;
  this.tags = `#${response.categories[0].alias}`;
  this.merchant_category = ['Happy Hour', 'Lunch', 'Dinner', 'Brunch'];
  this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  this.loc = {
    type: 'Point',
    coordinates: [response.coordinates.longitude, response.coordinates.latitude],
  };
  this.followers = [];
  this.promoted = false;
  this.large_image = response.image_url;
  this.menu = null;
  this.rating = response.rating;
}


module.exports = {
  index: {
    handler: (request, reply) => {
      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data');
      } else {
        const term = encodeURIComponent(request.query.term);
        const longitude = request.query.lon;
        const latitude = request.query.lat;
        const categories = 'restaurants,bars';
        const offset = request.query.offset || 0;
        const sort_by = 'distance';
        const open_now = true;
        yelp.search({ term, latitude, longitude, categories, offset, sort_by, open_now }, 
        (error, data) => {
          if (error) console.log(error);
          const modifiedArr = data.businesses.map(item => new Item(item));
          reply({ results: modifiedArr, count: data.total });
        });
      }
    },
  },
};
