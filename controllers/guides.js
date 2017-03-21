const paginate = require('mongojs-paginate');
const db = require('../helpers/db');


module.exports = {
  index: {
    handler(request, reply) {
      // get user interests and match with promotions tags
      const page = request.query.page || 1;
      const limit = request.query.limit || 20;
      const queryObject = {};

      const lng = Number(request.query.geo.split(',')[0]);
      const lat = Number(request.query.geo.split(',')[1]);
      queryObject.loc = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
            // $maxDistance: 16093.4 // 10 miles
        },
      };

      const query = db.guides.find(queryObject);

      paginate(query, {
        limit,
        page,
      }, (err, results) => {
        // Result:
        // items: containing items of the desired page
        // itemCount: non paged count of items returned by query
        // page: current page
        // pageCount: Number of pages
        // limit: Number of items returned by page
        // next: index of the next page or undefined if no next page exists
        // hasNext: true if next page exists otherwise false
        // previous: index of the previous page or undefined if no previous page exists
        // hasPrevious: true if previous page exists otherwise false
        reply(results);
      });
    },
  },
};
