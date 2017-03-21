require('dotenv').load();
const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const { listKey } = request.payload;

      db.guides.findAndModify({
        query: { listKey },
        update: { $addToSet: { places: request.payload } },
        new: true,
      }, (error, doc) => {
        if (error) console.log(error);
        reply(doc);
      });
    },
  },

};
