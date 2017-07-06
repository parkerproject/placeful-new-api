const tumblr = require('tumblr.js');
const { isArray } = require('lodash');
const getSlug = require('speakingurl');
// const unirest = require('unirest');
//
// const db = require('../helpers/db');

const client = tumblr.createClient({
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
  token: process.env.TUMBLR_TOKEN,
  token_secret: process.env.TUMBLR_TOKEN_SECRET,
});


exports.createGuideOnTumblr = (doc) => {
  const { image, title, hastags, cat, key } = doc;
  const slug = getSlug(title);
  const options = {
    source: image,
    caption: title,
    link: `https://placefulapp.com/m/${key}/${slug}`,
  };

  if (hastags) {
    options.tags = hastags;
  }
  if (!hastags && cat) {
    options.tags = !isArray(cat) ? cat : cat.toString();
  }

  client.createPhotoPost('placefulapp', options, (error) => {
    if (error) console.log(error);
  });
  return true;
};


// module.exports = {
//   //
//   index: {
//     handler(request, reply) {
//       db.guides.find((err, docs) => {
//         const doc = docs[20];
//         unirest.post('https://graph.facebook.com/v2.8/1565176217139571/photos')
//          .headers({ Accept: 'application/json', 'Content-Type': 'application/json' })
//          .send({
//            // access_token: process.env.FB_TOKEN,
//            access_token: process.env.FB_USER_TOKEN,
//            caption: doc.title,
//            url: doc.image,
//          })
//          .end((response) => {
//            console.log(response);
//            reply(doc);
//          });
//         return true;
//       });
//     },
//   },
// };
