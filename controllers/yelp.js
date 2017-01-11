require('dotenv').load();

const Yelp = require('yelp-v3');

const yelp = new Yelp({
  access_token: process.env.YELP_V3_TOKEN,
});


module.exports = (phone, cb) => {
  const cleanPhone = phone.replace(/[^A-Z0-9]/ig, '');

  yelp.phoneSearch({ phone: `+1${cleanPhone}` }, (error, data) => {
    if (error) {
      console.log(error);
    }
    if (data.businesses && data.businesses.length !== 0) {
      yelp.businessesReviews(data.businesses[0].id, (err, reviews) => {
        const yelpReviews = (reviews.reviews) ? reviews.reviews : [];
        cb(yelpReviews);
      });
    } else {
      cb([]);
    }
  });
};
