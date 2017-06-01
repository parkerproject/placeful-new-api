const algoliasearch = require('algoliasearch');

const db = require('../helpers/db');

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex('guides');

module.exports = {
  index: {
    handler(request, reply) {
      const { title, description, user, key, image } = request.payload;
      const query = { user, key };
      const update = { title, description, public: request.payload.public };
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
          if (error) console.log(error);

          index.partialUpdateObject({
            title,
            description,
            public: request.payload.public,
            objectID: key,
          }, (er) => {
            console.log(er);
            reply(userGuides);
          });
        });
      });
    },
  },
};
