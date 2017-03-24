const db = require('../helpers/db');


module.exports = {
  index: {
    handler(request, reply) {
      const queryObject = { user: request.query.user };
      db.guides.find(queryObject, (err, results) => {
        reply(results);
      });
    },
  },
};
