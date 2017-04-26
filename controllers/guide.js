const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const guide = Object.assign({}, request.payload, { public: true });
      db.guides.save(guide, () => {
        reply(1);
      });
    },
  },
};
