const db = require('../helpers/db');

const { createGuideOnTumblr } = require('./handle_social');

module.exports = {
  index: {
    handler(request, reply) {
      const guide = Object.assign({}, request.payload);
      db.guides.save(guide, () => {
        createGuideOnTumblr(guide); // temporary, will move this to event emitter or some async flow
        reply(1);
      });
    },
  },
};
