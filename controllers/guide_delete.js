const db = require('../helpers/db');

module.exports = {
  index: {
    handler(request, reply) {
      const { itemKey, userKey } = request.payload;
      const queryObject = { key: itemKey, user: userKey };
      db.guides.remove(queryObject, () => {
        db.guides.find({ user: userKey }, (error, data) => {
          reply(data);
        });
      });
    },
  },
};
