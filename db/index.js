const monk = require('monk');

const { connectUrl: url } = require('../configs/database');

monk(url).catch((err) => {
  console.log(err); // eslint-disable-line
  process.exit(1);
});

module.exports = {
  mongodbId: _id => monk.id(_id),
  User: monk(url).get('user'),
  Post: monk(url).get('post'),
  Category: monk(url).get('category'),
  Tag: monk(url).get('tag'),
  Comment: monk(url).get('comment'),
  Subscription: monk(url).get('subscription'),
};
