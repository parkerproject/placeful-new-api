require('dotenv').load();
const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      db.treck.save(request.payload, () => {
        reply(request.payload);
      });
    },
  },
};
