const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const { title, description, user, key, image } = request.payload;
      const query = { user, key };
      const update = { title, description };
      if (image) {
        update.image = image;
      }

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
