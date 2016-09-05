const slug = require('slug');
const randtoken = require('rand-token');

function Item(response, area) {
  const imageObj = response.venue.featuredPhotos.items[0];
  this.neighborhood = area;
  this.title = '';
  this.deal_id = response.deal_id;
  this.tipsText = response.tips[0].text;
  this.merchant_id = response.venue.id;
  this.phone = response.venue.contact.formattedPhone;
  this.twitter = response.venue.contact.twitter;
  this.merchant_address = response.venue.location.formattedAddress[0];
  this.merchant_name = response.venue.name;
  this.merchant_locality = response.venue.location.city;
  this.description = '';
  this.fine_print = '';
  this.start_date = '';
  this.end_date = '';
  this.slug = slug(response.venue.name);
  this.ticket_id = randtoken.generate(16);
  this.likes = [];
  this.start_time = response.venue.hours ? response.venue.hours.status : '';
  this.end_time = '';
  this.endTimeString = '';
  this.approved = true;
  this.tags = `#${response.venue.categories[0].pluralName.split(' ')[0].toLowerCase()}`;
  this.merchant_category = ['Happy Hour', 'Lunch', 'Dinner', 'Brunch'];
  this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  this.loc = {
    type: 'Point',
    coordinates: [response.venue.location.lng, response.venue.location.lat],
  };
  this.followers = [];
  this.promoted = false;
  this.large_image = `${imageObj.prefix}${imageObj.width}x${imageObj.height}${imageObj.suffix}`;
  this.menu = response.venue.menu ? response.venue.menu.mobileUrl : '';
  this.rating = response.venue.rating;
}

module.exports = (response, area) => new Item(response, area);
