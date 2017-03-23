require('dotenv').load();
const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const { key, user } = request.payload;

      db.guides.findAndModify({
        query: { key },
        update: { $pull: { likes: user } },
        new: true,
      }, (error, doc) => {
        if (error) console.log(error);
        reply(doc);
      });
    },
  },
};
