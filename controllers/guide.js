const db = require('../helpers/db');


module.exports = {
  index: {
    handler(request, reply) {
      db.guides.save(request.payload, () => {
        reply(1);
      });
    },
  },
};
