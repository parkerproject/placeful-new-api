require('dotenv').load();
const zomato = require('./zomato.js');
const slug = require('slug');
const randtoken = require('rand-token');

function hastags(str){
    var e = str.split(',')
    var hasTags = e.map(function(tag){
       return `#${tag.trim()} `
    });
    return hasTags.join('');
}

function Item(response) {
  this.neighborhood = response.location.locality;
  this.title = null;
  this.deal_id = null;
  this.tipsText = null;
  this.merchant_id = response.id;
  this.phone = response.null;
  this.twitter = null;
  this.merchant_address = response.location.address;
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
  this.tags = hastags(response.cuisines);
  this.merchant_category = ['Happy Hour', 'Lunch', 'Dinner', 'Brunch'];
  this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  this.loc = {
    type: 'Point',
    coordinates: [response.location.longitude, response.location.latitude],
  };
  this.followers = [];
  this.promoted = false;
  this.large_image = response.featured_image;
  this.menu = null;
  this.rating = response.user_rating.aggregate_rating;

  return this;
}


module.exports = {
  index: {
    handler: (request, reply) => {

      if (!request.query.key || request.query.key !== process.env.API_KEY) {
        reply('You need an api key to access data')
      }else{
        const obj = {}
        obj.lon = request.query.longitude;
        obj.lat = request.query.latitude;

        zomato.search(obj, (data) => {
          const restaurants = data.restaurants.map((restaurant)=>{
            return new Item(restaurant.restaurant)
          });
          reply(restaurants)
        });
      }
    },
  },
};
