const db = require('../helpers/db');

const { createGuideOnTumblr } = './handle_social';

module.exports = {
  index: {
    handler(request, reply) {
      const guide = Object.assign({}, request.payload);
      db.guides.save(guide, () => {
        createGuideOnTumblr(guide);
        reply(1);
      });
    },
  },
};
