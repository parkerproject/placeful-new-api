require('dotenv').load();
const algoliasearch = require('algoliasearch');

const db = require('../helpers/db');

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
const index = client.initIndex('guides');

module.exports = {
  index: {
    handler(request, reply) {
      const { key, user } = request.payload;

      db.guides.findAndModify({
        query: { key },
        update: { $addToSet: { likes: user } },
        new: true,
      }, (error, doc) => {
        if (error) console.log(error);
        index.partialUpdateObject({
          likes: {
            value: user,
            _operation: 'Add',
          },
          objectID: key,
        }, (err, content) => {
          reply(doc);
        });
      });
    },
  },
};
