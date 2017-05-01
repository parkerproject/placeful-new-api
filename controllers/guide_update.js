const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const { title, description, user, key } = request.payload;
      const query = { user, key };
      const update = { title, description };

      db.guides.findAndModify({
        query,
        update: { $set: update },
        new: true,
      }, (err) => {
        if (err) console.log(err);
        db.guides.find({ user }, (error, userGuides) => {
          reply(userGuides);
        });
      });
    },
  },
};
